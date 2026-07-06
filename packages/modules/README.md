# @myapp/modules

Shared app-level UI modules for reusable product surfaces.

Use this package for composed, application-aware UI that is larger than a
primitive but not necessarily a full screen:

- `LoginForm`
- `LoginScreen`
- `ProfileEditor`
- `SettingsPanel`
- `AccountMenu`

Keep generic building blocks in `@myapp/ui`. Keep modules reusable by passing
navigation and environment-specific behavior in through props instead of
coupling them directly to a specific router.
