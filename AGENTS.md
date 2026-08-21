# Engineering guidelines for alerts.surf

## Project context

alerts.surf is a surf conditions and alerting platform. Its core product goal is to help surfers know where and when conditions are likely to be good based on factors such as swell, wind, tide, spot characteristics, and user preferences.

The project may later include:

- Personalized surf alerts.
- Surf spot intelligence.
- Condition scoring.
- Historical data.
- User reports.
- AI-assisted explanations and recommendations.
- PWA functionality.

These future capabilities must not be implemented until they are explicitly specified. The initial architecture must favor simplicity and the ability to evolve.

## Development approach

- Build incrementally using spec-driven development.
- Never generate the whole application at once.
- Prefer small, reviewable vertical slices.
- Implement only the scope required by the active spec.
- Do not modify unrelated parts of the codebase while implementing a spec.
- Do not add dependencies or infrastructure unless required by the current spec.
- Avoid premature abstractions.
- Favor explicit code over clever abstractions.
- Every meaningful feature must have automated tests.

## Architecture and domain boundaries

- Prefer a modular monolith initially.
- Avoid microservices unless there is a demonstrated need.
- Domain logic must not depend on frameworks.
- Keep business logic separated from infrastructure concerns.
- Use clear bounded contexts where they naturally exist.
- Isolate all external integrations behind interfaces or adapters.
- Discuss any architectural decision with significant long-term impact before implementation.
- Do not silently introduce frameworks, databases, queues, caches, AI frameworks, cloud services, or other substantial infrastructure.

## Configuration and security

- Never commit secrets or credentials.
- Environment-specific configuration must come from environment variables.

## AI usage

- Prefer deterministic logic over LLM calls whenever possible.
- AI should augment the product, not become the source of truth for structured or safety-critical data.

## Reliability

- Keep observability, failure handling, and idempotency in mind for integrations and background work.

## Agent workflow

1. Read `AGENTS.md`.
2. Read the active spec.
3. Inspect the existing code.
4. Propose a short implementation plan.
5. Implement only the requested scope.
6. Run tests and linting.
7. Report changed files and relevant decisions.
8. Stop and wait for review.
