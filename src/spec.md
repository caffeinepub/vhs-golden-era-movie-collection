# Specification

## Summary
**Goal:** Add numbered pagination controls to the movie grid so users can jump directly to a specific page.

**Planned changes:**
- Add a backend query that returns pagination metadata for the movies list (at minimum, `totalPages` based on `ITEMS_PER_PAGE`), without mutating state and handling the 0-movies case safely.
- Update the movie grid pagination UI to show clickable, highlighted page numbers (while keeping existing Back/Next controls), using a compact windowed layout with ellipses for large page counts.
- Add a React Query hook to fetch pagination metadata and wire it into `MovieGrid`, with graceful fallback to Back/Next if metadata fails to load.
- Keep numbered pagination hidden/disabled when a genre filter is active, consistent with current behavior (pagination applies only to the unfiltered list).

**User-visible outcome:** Users browsing the unfiltered movie list can click page numbers (in addition to Back/Next) to jump to a specific page; genre-filtered browsing continues without numbered pagination.
