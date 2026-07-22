import type { APIRoute } from 'astro';

export const prerender = false;

// This endpoint has been retired. Community edits now go through GitHub's native
// "Edit this page" flow (see CustomEditLink.astro / Starlight editLink), which
// requires a GitHub account and opens a standard pull request under the
// contributor's own identity. The previous anonymous in-browser submission path
// (committed to a public repo via a server-side token) was removed for privacy
// and abuse-safety: it published user content publicly, trusted a spoofable
// X-Forwarded-For for rate limiting, and allowed arbitrary file paths in PRs.
export const POST: APIRoute = async () =>
  new Response(
    JSON.stringify({
      message:
        'This submission endpoint is no longer available. Use the "Edit this page on GitHub" link to propose changes via a pull request.',
    }),
    { status: 410, headers: { 'Content-Type': 'application/json' } },
  );

export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify({ message: 'Endpoint retired. Use GitHub pull requests to edit.' }),
    { status: 410, headers: { 'Content-Type': 'application/json' } },
  );