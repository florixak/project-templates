import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { greetFn, greetingSchema } from '#/functions/demo.functions.ts'
import { isOk } from '#/lib/api-response.ts'
import type { ApiResponse } from '#/lib/api-response.ts'

export function GreetingForm() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (
      name: string,
    ): Promise<ApiResponse<{ message: string }>> => {
      return greetFn({ data: { name } })
    },
    onSuccess: (response) => {
      if (isOk(response)) {
        setResult(response.data.message)
        setError(null)
        return
      }
      setResult(null)
      setError(response.error.message)
    },
    onError: (err) => {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Request failed')
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: greetingSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.name)
    },
  })

  return (
    <div className="space-y-4">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="given-name"
              />
              {field.state.meta.errors[0] ? (
                <p className="text-sm text-destructive">
                  {typeof field.state.meta.errors[0] === 'string'
                    ? field.state.meta.errors[0]
                    : field.state.meta.errors[0]?.message}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? 'Sending…' : 'Greet me'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      {result ? (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          {result}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
