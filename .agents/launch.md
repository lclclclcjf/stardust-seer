# Launch Notes

- Production deploys automatically from pushes to `origin/master` through Vercel.
- UI-only releases without dependency, environment, API, or data changes are low risk after lint, production build, and focused browser interaction checks pass.
- Primary rollback is a revert of the release commit followed by a push to `origin/master`; Vercel's previous deployment remains the secondary rollback path.
- Release `12eeaa2` published the universal elemental card-face medallions to production on 2026-09-10. Lint, six AI boundary/rate-limit tests, two production builds, local reveal inspection, four asset checks, art-book discovery, and a production select/reveal flow passed. Roll back by reverting `12eeaa2` and pushing `master`, or promote the preceding Vercel deployment.
