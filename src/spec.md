# Specification

## Summary
**Goal:** Restore app usability when the backend canister is stopped or unreachable by detecting backend health and showing a dedicated recovery experience instead of a broken/empty UI.

**Planned changes:**
- Backend: add an unauthenticated public query health endpoint in `backend/main.mo` that returns a simple “ok”/version-style response and never traps for anonymous callers.
- Frontend: add a full-page “Backend unavailable” recovery UI that appears on stopped-canister errors or actor initialization failure, reusing the existing stopped-canister copy from `frontend/src/utils/errors.ts`.
- Frontend: run a startup connectivity/health check before enabling movie/genre/pagination queries; show a non-blocking loading state while checking.
- Frontend: route failed health checks and relevant query failures into the recovery UI; provide actions for **Reload** (full page refresh) and **Retry** (re-run health check and refetch queries without reload), returning to normal operation once backend is available.

**User-visible outcome:** When the backend is stopped/unavailable, users see a clear full-page recovery screen with Reload/Retry instead of a broken app; once the backend is back, Retry restores normal browsing without requiring a hard refresh.
