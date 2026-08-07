import { createFileRoute } from '@tanstack/react-router'

import { GreetingForm } from '#/components/demo/greeting-form.tsx'

export const Route = createFileRoute('/demo/server-fn')({
  component: ServerFnDemoPage,
})

function ServerFnDemoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Typed server functions
        </h1>
        <p className="text-muted-foreground text-sm">
          Form input is validated with Zod on the client and again in{' '}
          <code className="text-foreground">createServerFn().validator()</code>.
          Server-only helpers live in{' '}
          <code className="text-foreground">*.server.ts</code> modules.
          Mutations return a unified{' '}
          <code className="text-foreground">ApiResponse</code> envelope.
        </p>
      </div>

      <div className="rounded-xl border border-border/80 p-5">
        <GreetingForm />
      </div>

      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
        {`{
  "success": true,
  "data": { "message": "Hello, Ada!" }
}

{
  "success": false,
  "error": { "message": "Validation failed", "details": [...] }
}`}
      </pre>
    </div>
  )
}
