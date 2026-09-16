import { describe, expect, it } from "vitest"
import cs from "@/messages/cs.json"
import en from "@/messages/en.json"
import { localeLabels, routing } from "./routing"

type MessageTree = { [key: string]: string | MessageTree }

/** Flattens nested messages into dot-separated keys. */
function flatten(tree: MessageTree, prefix = ""): Record<string, string> {
  const flat: Record<string, string> = {}

  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof value === "string") {
      flat[path] = value
    } else {
      Object.assign(flat, flatten(value, path))
    }
  }

  return flat
}

/** ICU argument names used by a message, e.g. `"{year}"` -> `["year"]`. */
function icuArguments(message: string) {
  return [...message.matchAll(/\{\s*(\w+)/g)].map((match) => match[1]).sort()
}

const flatEn = flatten(en)
const flatCs = flatten(cs)

describe("routing", () => {
  it("serves English as the default locale and Czech as the second", () => {
    expect(routing.locales).toEqual(["en", "cs"])
    expect(routing.defaultLocale).toBe("en")
  })

  it("resolves the locale from the URL only", () => {
    expect(routing.localePrefix).toBe("as-needed")
    expect(routing.localeDetection).toBe(false)
    expect(routing.localeCookie).toBe(false)
  })

  it("has a switcher label for every locale", () => {
    for (const locale of routing.locales) {
      expect(localeLabels[locale]?.trim()).toBeTruthy()
    }
  })
})

describe("messages", () => {
  it("translates every English key into Czech", () => {
    expect(Object.keys(flatCs).sort()).toEqual(Object.keys(flatEn).sort())
  })

  it("uses the same ICU arguments in both locales", () => {
    for (const [key, message] of Object.entries(flatEn)) {
      expect(icuArguments(flatCs[key]), key).toEqual(icuArguments(message))
    }
  })

  it("has no blank translations", () => {
    for (const [locale, messages] of [
      ["en", flatEn],
      ["cs", flatCs],
    ] as const) {
      for (const [key, message] of Object.entries(messages)) {
        expect(message.trim(), `${locale}.${key}`).not.toBe("")
      }
    }
  })
})
