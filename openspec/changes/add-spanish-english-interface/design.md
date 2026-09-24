## Context

The current Vue frontend has static copy embedded in its landing, login, mockup, and dashboard components. It has no language dependency or router. See proposal.md for motivation and the interface-language spec for user behavior.

## Goals / Non-Goals

**Goals:** Keep language selection reactive across the existing single-page app, including the authenticated view, and make translations easy to inspect in one place.

**Non-Goals:** Translate user-generated or arbitrary backend text; add server-side localization, routing, or a third-party i18n package.

## Decisions

- Use a small shared Vue `ref` for `es`/`en` and a typed local dictionary. All current components read the same locale and translate fixed UI strings through a single helper. This is justified by copy spanning multiple components; a full i18n library would add dependency and configuration for two static locales.
- Read one explicit saved choice from `localStorage` when available; otherwise inspect `navigator.language`. A saved choice wins over browser detection. If the storage API is unavailable, selection still works for the current page.
- Keep the switch as a compact, accessible control reused in the public header and dashboard header. Store only `es` or `en`, and update `document.documentElement.lang` whenever the locale changes.
- Translate demo copy in the interactive preview. Leave brand, spot, board model names, and raw API data as supplied. Known API enum labels such as tide trend or alert status can be translated at the display boundary without changing the API.

## Risks / Trade-offs

- A two-locale dictionary can grow as features are added → keep keys tied to actual copy and revisit only if translation needs become complex.
- Browser storage can be disabled → keep the in-memory selection active and fall back to browser detection on a later visit.
- English text is currently embedded in component tests → update assertions to select a deterministic locale and add behavioral tests for detection, switching, persistence, and both views.

## Migration Plan

Deploy with the existing frontend build. Browser data and backend schema need no migration. Rollback is the previous frontend image; the optional saved language value has no effect there.
