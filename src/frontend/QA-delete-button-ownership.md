# QA Checklist: Delete Button Ownership

This document provides a manual QA checklist to verify that the Delete button on movie cards correctly reflects ownership based on Internet Identity authentication.

## Test Steps

### 1. Initial State (Not Logged In)
- [ ] Open the application without logging in
- [ ] Verify that no Delete buttons are visible on any movie cards
- [ ] Verify that the "Add Movie" button is disabled or shows an auth prompt

### 2. Login and Create Movie
- [ ] Click the "LOG IN" button in the header
- [ ] Complete Internet Identity authentication
- [ ] Verify the button changes to "LOG OUT" and shows "AUTHENTICATED" status
- [ ] Click "ADD MOVIE" button
- [ ] Fill in movie details (title, description, photos, genres)
- [ ] Submit the form
- [ ] **Verify the Delete button (trash icon) appears on the newly created movie card WITHOUT requiring a page refresh**

### 3. Logout
- [ ] Click the "LOG OUT" button
- [ ] Verify the button changes back to "LOG IN"
- [ ] **Verify the Delete button disappears from all movie cards WITHOUT requiring a page refresh**

### 4. Login as Different User
- [ ] Click "LOG IN" again
- [ ] Authenticate with a DIFFERENT Internet Identity principal
- [ ] Verify you are logged in (button shows "LOG OUT")
- [ ] **Verify the Delete button does NOT appear on movies created by the first user**
- [ ] Create a new movie with this second identity
- [ ] **Verify the Delete button appears ONLY on the movie created by the second user**

### 5. Permission Enforcement
- [ ] While logged in as the second user, verify you cannot see Delete buttons for the first user's movies
- [ ] Create another movie and verify its Delete button appears immediately
- [ ] Log out and verify all Delete buttons disappear

## Expected Behavior

- Delete buttons should appear/disappear immediately after login/logout without page refresh
- Delete buttons should only be visible for movies where `movie.creator` matches the current authenticated principal
- No runtime errors should occur during principal comparison
- The UI should update reactively as authentication state changes

## Common Issues to Watch For

- Delete button not appearing after login (requires page refresh) ❌
- Delete button appearing for movies created by other users ❌
- Runtime errors related to `identity.getPrincipal()` ❌
- Delete button not disappearing after logout ❌
