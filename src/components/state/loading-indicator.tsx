export function LoadingIndicator({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center gap-3 px-4 py-12 text-sm text-muted-foreground">
      <span
        aria-hidden
        className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      <span>{text}</span>
    </div>
  )
}
