This codebase will outlive you. Every shortcut compounds into debt. The patterns you establish will be copied. Fight entropy.

Before coding any story, read in order:

1. `docs/implementation-plan.md` — story scope + acceptance criteria
2. `PRD.md` — product context for the screen/flow
3. `docs/api-reference.md` — find endpoint(s) by tag or operationId
4. `docs/openapi.json` — grep by operationId, schema name, or path for full types
5. `docs/architecture.md` — folder structure, API layer, state management
6. `docs/design-system.md` — colors, typography, spacing

---

## Styling

Read `docs/design-system.md` and copy exact hex values. Never write a color from memory.

---

## Localization

Romanian only. All strings in `constants/localization.ts` — never inline.

---

## Icon System

1. SF Symbol name → MaterialIcons mapping in `components/ui/icon-symbol.tsx`
2. Sizes: tab=28, inline=16-20, card=24, header=24, empty=48-64