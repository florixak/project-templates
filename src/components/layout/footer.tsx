import { siteConfig } from '#/lib/config.ts'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <a
          href={siteConfig.github}
          className="hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          project-templates
        </a>
      </div>
    </footer>
  )
}
