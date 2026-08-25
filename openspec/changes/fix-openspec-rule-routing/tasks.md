## 1. Correct OpenSpec Rule Routing

- [x] 1.1 Move the existing architecture rules into `rules.design`, move the existing testing rules into `rules.tasks`, and remove the unsupported `rules.architecture` and `rules.testing` keys; verify the schema, project context, and rule wording remain unchanged.
- [x] 1.2 Run the OpenSpec instruction lookup for `design` and `tasks`; verify neither command reports unknown artifact IDs, design instructions contain the architecture guidance, and task instructions contain the testing guidance.
- [x] 1.3 Run strict OpenSpec validation and inspect the final diff; verify all specs and active changes are valid and no application, dependency, infrastructure, or archived-change files were modified.
