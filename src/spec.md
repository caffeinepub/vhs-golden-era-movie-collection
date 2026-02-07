# Specification

## Summary
**Goal:** Make the catalog installable as a home-screen Progressive Web App (PWA) on iOS and Android, with basic offline app-shell support.

**Planned changes:**
- Add a valid web app manifest served from the app origin, including required fields and icon entries.
- Add/install PWA icon assets (including maskable and Apple touch icon) and wire them via manifest and HTML meta/link tags for installability on Android and iOS.
- Implement and register a service worker (from an editable module) to cache static assets for an offline-capable app shell without impacting Internet Identity auth flows.
- Add an in-app English “Install on phone” help entry in an existing discoverable UI location (e.g., Footer), with platform-specific steps for Android Chrome and iOS Safari, matching the app’s retro styling.

**User-visible outcome:** Users can install the catalog to their home screen on Android and iOS with correct icons/name, open it in standalone mode, and see a basic cached shell when offline, plus clear in-app instructions for installation.
