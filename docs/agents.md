# Agent Guidelines

This codebase will outlive you. Every shortcut compounds into debt. The patterns you establish will be copied. Fight entropy.

## Skills (Auto-Discovery)

Two skill sets are installed and activate automatically. Follow them — they have detailed code examples. **When they conflict with this file, this file wins.**

## Documentation Workflow

Before coding any story, read in order:

1. `docs/implementation-plan.md` — story scope + acceptance criteria
2. `PRD.md` — product context for the screen/flow
3. `docs/api-reference.md` — find endpoint(s) by tag or operationId
4. `docs/openapi.json` — grep by operationId, schema name, or path for full types
5. `docs/architecture.md` — folder structure, API layer, state management
6. `docs/design-system.md` — colors, typography, spacing

---

## Styling

`StyleSheet.create()` exclusively. No Tailwind, no NativeWind, no inline objects for static styles.

**Spacing** — always tokens: `Spacing.sm`, `Spacing.md`, `Spacing.lg` (never `padding: 16`)
**Colors** — always tokens: `useThemeColor()` or `Colors.light.*` (never `'#14213D'`)

> **⚠️ CRITICAL: Read `docs/design-system.md` and copy exact hex values. Never write a color from memory. Every status color, category color, and urgency color has a specific hex — if you use a different shade, the PR will be rejected.**

---

## Accessibility

- Every `Pressable` needs `accessibilityRole` + `accessibilityLabel`
- Touch targets: min 44×44pt iOS, 48×48dp Android. Use `hitSlop` for small elements.
- Images: always `accessibilityLabel`

---

## Localization

Romanian only. All strings in `constants/localization.ts` — never inline.

---

## Icon System

1. SF Symbol name → MaterialIcons mapping in `components/ui/icon-symbol.tsx`
2. Sizes: tab=28, inline=16-20, card=24, header=24, empty=48-64

---

## Git Workflow

- Branch: `feat/S{nn}-short-name` (also `fix/`, `refactor/`, `docs/`)
- Commits: `type(scope): description` — English, conventional commits