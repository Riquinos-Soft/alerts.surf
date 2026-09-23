## Why

`alerts.surf` currently displays only a minimal operational status screen (`alerts.surf is running`). To establish a compelling, professional presence for visitors and early users, the platform needs a welcoming, high-polish landing page ("landscape") inspired by clean, modern product showcases (like Apple and leading design-forward web apps). This landing page must clearly communicate the platform's value proposition—accurate surf intelligence, spot conditions, personalized alerts, and the future vision of an agentic assistant for boards and forecasting—while maintaining high performance, accessible markup, and clean UI without premature framework bloat.

## What Changes

- Introduce a landscape welcome landing experience on the main frontend route (`/`).
- Design an Apple-inspired, ultra-clean aesthetic featuring refined typography, subtle atmospheric gradients, glassmorphism accents, smooth entrance transitions, and interactive feature highlights.
- Showcase the core product capabilities and upcoming product vision:
  - **Surf Condition Intelligence**: Swell, period, wind, tide, and condition scoring.
  - **Spot Exploration**: Spotlight on regional surf breaks and conditions.
  - **Agentic Assistant & Board Management**: Vision showcase for natural voice/chat interaction to dial in preferences, log boards, and query live wave recommendations.
  - **Predictive Alerts**: Notification triggers when ideal spot criteria are met.
  - **Accessible Value Pricing**: Transparent, disruptive pricing preview for high-precision forecast access.
- Retain platform operational transparency: include a discreet, elegant live system status indicator connected to `/api/status` without cluttering the primary user journey.
- Implement responsive layout supporting desktop, tablet, and mobile views with zero external UI framework dependencies.

## Capabilities

### New Capabilities
- `welcome-landing`: Interactive landscape welcome page presenting platform value, interactive product showcases, and system health status.

### Modified Capabilities
<!-- None: existing backend API contracts (/api/status) and specs remain fully compatible. -->

## Impact

- **Frontend**: Extends `frontend/src/App.vue` and `frontend/src/style.css` (or modular landing components) to render the new presentation layout while preserving status fetching.
- **Dependencies**: Zero new npm dependencies; relies purely on native CSS, SVG graphics, and Vue 3 reactivity.
- **Backend / Infrastructure**: No changes to backend APIs or deployment infrastructure.
