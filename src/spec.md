# Specification

## Summary
**Goal:** Restore the movie collection app’s connectivity by restarting the stopped backend canister without data loss, and improve the frontend UX for stopped-canister errors and URL hash token cleanup.

**Planned changes:**
- Deploy an upgrade/build to bring backend canister `gnqlv-giaaa-aaaaq-awbrq-cai` back to a running state while preserving existing movie data.
- Update frontend error normalization to detect “canister is stopped” / “Reject code: 5” and show a clear English message indicating the backend canister is stopped, with a recovery action (e.g., reload).
- Fix URL hash cleanup so `#caffeineAdminToken=...` is removed after storing to `sessionStorage`, while preserving other hash routes/parameters (e.g., keep `#/route?other=x`).

**User-visible outcome:** Movies load again without “canister is stopped” failures, and if the backend is stopped the app shows a clear English error with a reload/recovery option; admin token hash fragments are cleaned from the URL without breaking hash routing.
