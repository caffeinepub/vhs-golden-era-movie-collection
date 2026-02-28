# Specification

## Summary
**Goal:** Fix the catalog page so it loads correctly by resolving backend errors and frontend rendering issues.

**Planned changes:**
- Audit and fix the backend Motoko actor so that movie listing, pagination, and genre filtering queries return valid responses without trapping or throwing unhandled errors.
- Ensure the backend canister health check reports as available on page load.
- Fix the MovieGrid component and React Query hooks so the catalog page renders movie cards when backend data is available.
- Add graceful handling for loading, error, and empty states on the catalog page so it never appears blank or stuck in a loading loop.
- Ensure pagination controls and genre filters work correctly without a page reload.

**User-visible outcome:** The catalog page loads and displays a grid of movies, with working pagination and genre filtering, and shows a clear error message if the backend is unavailable instead of a blank page.
