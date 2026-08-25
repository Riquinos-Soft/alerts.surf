## Why

`openspec/config.yaml` defines rules under the unsupported artifact IDs `testing` and `architecture`. OpenSpec warns on every artifact-instruction lookup and does not apply those rules, so the project guidance is noisier and less reliable than intended.

## What Changes

- Move the existing testing guidance to the supported `tasks` artifact rules.
- Move the existing architecture guidance to the supported `design` artifact rules.
- Preserve the current `spec-driven` schema, project context, and wording of every rule.
- Verify OpenSpec no longer reports unknown artifact IDs and routes the rules to the intended artifact instructions.

## Capabilities

### New Capabilities

None. This is a project-tooling configuration correction with no product behavior change.

### Modified Capabilities

None.

## Impact

- Changes only `openspec/config.yaml` and this change's planning artifacts.
- Affects guidance supplied when future OpenSpec design and task artifacts are created.
- Does not change application code, APIs, dependencies, infrastructure, or the archived `application-status` capability.
