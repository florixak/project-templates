// Last-resort 404, rendered when no locale could be resolved for the request —
// e.g. `/unknown.txt`, which the proxy skips, or an unsupported locale such as
// `/de`. Both bypass `app/[locale]/layout.tsx`, so this file has to bring its
// own `html`/`body` and cannot use `next-intl`: there are no messages without a
// locale. Localized 404s live in `app/[locale]/not-found.tsx`.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "16px",
          padding: "32px",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          404 — Page not found
        </h2>
        <p style={{ color: "#666", maxWidth: "400px", margin: 0 }}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Go home
        </a>
      </body>
    </html>
  )
}
