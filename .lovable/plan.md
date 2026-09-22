# Remove Dark Mode

## What will change
- Remove every visible theme switcher from the sidebar, sign-in page, shared analysis page, settings, and command menu.
- Remove theme state, saved-theme handling, dark-mode keyboard behavior, and the unused theme-toggle component.
- Remove dark CSS variants, dark color overrides, and class-based dark-mode configuration while retaining each existing light-mode value unchanged.
- Keep chart theming permanently on its current light palette.

## Verification
- Search the app for any remaining dark-theme controls, logic, selectors, or utility variants.
- Confirm the app builds successfully and renders in light mode even if an old `dark` class or saved theme exists.
- Check key public and signed-in screens without changing layout or behavior beyond removing theme controls.
