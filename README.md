# project-templates

Opinionated, production-ready starter templates for my go-to stacks. One repo, one branch per stack — pick the branch you need and hit **Use this template**.

No boilerplate fatigue, no re-configuring the same tooling for the tenth time.

## How to use

1. Click **Use this template** above.
2. On the "Create a new repository" screen, check **Include all branches** — without this, only `main` (the index page, not an actual stack) gets copied.
3. Name your new repo and generate it.
4. In your new repo, check out the branch for the stack you want (see table below) — that becomes your working branch.

Prefer the CLI?

```bash
gh repo create my-app --template florixak/project-templates --include-all-branches --clone
cd my-app && git checkout nextjs   # or nestjs, spring-boot, ...
```

## Available templates

| Branch | Stack | Status | Notes |
|---|---|---|---|
| [`nextjs`](../../tree/nextjs) | Next.js 16 + React 19 + TypeScript | ✅ Stable | Tailwind v4, shadcn/ui, Biome, Vitest, Husky. See branch README for full details. |
| [`nestjs`](../../tree/nestjs) | NestJS + TypeScript | 🚧 In progress | |
| [`spring-boot`](../../tree/spring-boot) | Spring Boot + Java/Kotlin | 🚧 In progress | |

*(Update this table whenever a branch is added, renamed, or its status changes.)*

## Philosophy

Every template in this repo follows the same rules, regardless of stack:

- **Opinionated defaults** — no "choose your own linter" decision fatigue. One correct way to format, lint, test, and commit.
- **Zero dead weight** — nothing is in a template "just in case." If it's not used in most projects on that stack, it's documented as optional, not pre-installed.
- **AI-agent friendly** — every branch ships an `AGENTS.md` with conventions and known gotchas, so tools like Claude Code produce code that matches the rest of the codebase instead of guessing.
- **Security-first defaults** — auth, env validation, and framework-specific footguns (e.g. proxy/middleware not being an auth boundary) are called out explicitly, not left as a surprise.

## Adding a new template

1. Create a new orphan branch from `main`:
   ```bash
   git checkout --orphan <stack-name>
   git rm -rf .
   ```
2. Build out the starter, including its own `README.md` and `AGENTS.md`.
3. Push the branch and add a row to the table above.

## License

MIT — use any of these templates for anything, including commercially, as long as the copyright and permission notice in [`LICENSE`](LICENSE) is retained in copies or substantial portions of the code.