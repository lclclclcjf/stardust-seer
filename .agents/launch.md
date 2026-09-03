# Launch Notes

- Production deploys automatically from pushes to `origin/master` through Vercel.
- UI-only releases without dependency, environment, API, or data changes are low risk after lint, production build, and focused browser interaction checks pass.
- Primary rollback is a revert of the release commit followed by a push to `origin/master`; Vercel's previous deployment remains the secondary rollback path.
