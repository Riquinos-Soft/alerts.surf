## Why

The public landing page and beta dashboard currently mix English and Spanish, so visitors cannot use the interface consistently in their preferred language. A small language switch makes the existing experience understandable without changing product behavior.

## What Changes

- Provide complete Spanish and English interface copy for the existing landing, login, dashboard, and interactive preview.
- Initially select Spanish for Spanish browser languages, English for other declared browser languages, and Spanish when no browser language is available.
- Let visitors switch language at any time and remember that explicit choice on the device.
- Keep the document language in sync for assistive technology.

## Capabilities

### New Capabilities

- `interface-language`: Language selection, persistence, and translation of the current frontend experience.

### Modified Capabilities

None.

## Impact

Frontend Vue components, a small shared locale module, and frontend tests. No backend API, database, dependency, or deployment change.
