# Specification

## Summary
**Goal:** Prevent guests and non-owners from adding or deleting movies, so only the movie creator can delete their own movies while everyone can still browse.

**Planned changes:**
- Backend: store the caller Principal as the owner when a movie is created.
- Backend: enforce authorization so only the stored owner can delete a movie; reject add/delete calls from unauthorized or anonymous callers.
- Backend: include movie owner identifier in movie records returned by read/query methods so the frontend can determine ownership.
- Frontend: hide/disable Delete for non-owners and prevent opening/submitting Add Movie when the user is not authenticated; show an English error message if the backend rejects add/delete.

**User-visible outcome:** Anonymous visitors can browse movies but cannot add or delete; signed-in users can add movies and can delete only movies they created, with clear error messaging when an action is not allowed.
