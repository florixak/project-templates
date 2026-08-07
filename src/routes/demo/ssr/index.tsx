import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/ssr/')({
  component: SsrModesIndexPage,
})

const modes = [
  {
    to: '/demo/ssr/full',
    title: 'ssr: true',
    body: 'Loaders run on the server and the route component is rendered to HTML.',
  },
  {
    to: '/demo/ssr/data-only',
    title: "ssr: 'data-only'",
    body: 'Loaders still run on the server, but the component hydrates on the client.',
  },
  {
    to: '/demo/ssr/client',
    title: 'ssr: false',
    body: 'Skip server loaders and component render for this route on the initial request.',
  },
] as const

function SsrModesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Selective SSR modes
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose the right mode per route without changing how you author
          loaders, search schemas, or components.
        </p>
      </div>

      <ul className="grid gap-3">
        {modes.map((mode) => (
          <li key={mode.to}>
            <Link
              to={mode.to}
              className="block rounded-xl border border-border/80 px-4 py-4 transition-colors hover:bg-accent/40"
            >
              <h2 className="font-medium tracking-tight">{mode.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{mode.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
