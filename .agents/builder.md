# Builder Journal

- 2026-08-24: AI readings are generated only for non-empty user questions. Browser-provided draw IDs/card IDs are untrusted; the server rebuilds card and spread context from local canonical data before contacting OpenAI.
- 2026-08-24: OpenAI credentials remain server-only. The Responses API integration uses strict structured output, `store: false`, request timeouts, same-origin checks, per-instance rate limiting, short-lived caching, and a fallback to local card meanings.
