# Agent Guidelines

This codebase will outlive you. Every shortcut compounds into debt. The patterns you establish will be copied. Fight entropy.

Rules for AI agents on Civiti-Mobile. **This file takes precedence** over all skills.

---

## Skills (Auto-Discovery)

Two skill sets are installed and activate automatically. Follow them — they have detailed code examples. **When they conflict with this file, this file wins.**

### Expo Skills — `npx skills add expo/skills` ([source](https://github.com/expo/skills))

| Override | Expo says | We do |
|---|---|---|
| Styling | Inline styles | `StyleSheet.create()` |
| Tabs | `NativeTabs` | Standard `Tabs` from `expo-router` |
| Storage | `localStorage` polyfill | `expo-secure-store` (auth) + `AsyncStorage` (drafts) |

### Vercel Agent Skills — `npx skills add vercel-labs/agent-skills` ([source](https://github.com/vercel-labs/agent-skills))

35+ React Native rules + composition patterns. Most align with this project.

| Override | Vercel says | We do |
|---|---|---|
| Lists | `LegendList` / `FlashList` | `FlatList` (no extra dep for v1) |
| Tabs | `NativeTabs` / `react-native-bottom-tabs` | Standard `Tabs` from `expo-router` |
| Lightbox | `@nandorojo/galeria` | Not needed (civic issue photos) |
| Context menus | `zeego` | Not in v1 scope |
| Modals | Native `Modal` formSheet | Expo Router `presentation: 'modal'` |
| Fonts | Config plugin | `useFonts` for dev (config plugin later) |
| Touchable | `Pressable` | **Adopt** — use `Pressable` over `TouchableOpacity` |

---

## Documentation Workflow

Before coding any story, read in order:

1. `docs/implementation-plan.md` — story scope + acceptance criteria
2. `PRD.md` — product context for the screen/flow
3. `docs/api-reference.md` — find endpoint(s) by tag or operationId
4. `docs/openapi.json` — grep by operationId, schema name, or path for full types
5. `docs/architecture.md` — folder structure, API layer, state management
6. `docs/design-system.md` — colors, typography, spacing

Never hardcode response shapes — derive types from the OpenAPI spec.

---

## TypeScript

**Strict mode ON.** Zero tolerance for `any`, non-null assertions (`!`), or type casting (`as`).

- Use `type` (not `interface`) for everything unless declaration merging is needed
- Use `type` imports: `import type { X } from '...'`
- Type narrow: `if (!user) return null;` — not `user!.name`

### Naming

| Thing | Convention | Example |
|---|---|---|
| Types | `PascalCase` | `IssueListResponse` |
| Props | `{Component}Props` | `IssueCardProps` |
| Functions | `camelCase` | `getIssues` |
| Components | `PascalCase` | `IssueCard` |
| Hooks | `useCamelCase` | `useIssues` |
| Constants | `SCREAMING_SNAKE` or `PascalCase` | `API_BASE_URL`, `Spacing` |
| Files | `kebab-case` | `issue-card.tsx` |
| Booleans | `is/has/should` prefix | `isLoading`, `hasVoted` |

---

## Imports & Exports

**Always** `@/` path alias. Never `../` or `./`.

**Import order:** React/RN → Expo/third-party → Components → Hooks → Services/Types/Constants

**Exports:** Screens/layouts = `export default function`. Everything else = named exports.

---

## Styling

`StyleSheet.create()` exclusively. No Tailwind, no NativeWind, no inline objects for static styles.

```tsx
// Dynamic theme values inline OK
<View style={[styles.container, { backgroundColor }]}>

// Static styles always in StyleSheet
const styles = StyleSheet.create({ container: { flex: 1, padding: Spacing.lg } });
```

**Spacing** — always tokens: `Spacing.sm`, `Spacing.md`, `Spacing.lg` (never `padding: 16`)
**Colors** — always tokens: `useThemeColor()` or `Colors.light.*` (never `'#14213D'`)

---

## Component Patterns

- Extend native types: `type ButtonProps = PressableProps & { variant: '...' }`
- Children: `PropsWithChildren<{ title: string }>`
- File order: imports → types → component → `StyleSheet.create()` (nothing after styles)
- One component per file, max ~250 lines. >5 props = consider splitting.
- Use `Pressable` (not `TouchableOpacity`)

---

## Screen Patterns

See `docs/architecture.md` for full details. Key structure:

```tsx
export default function XScreen() {
  // 1. Hooks (router, params, auth, data)
  // 2. Derived state
  // 3. if (isLoading) return <LoadingSkeleton />
  // 4. if (error) return <ErrorState />
  // 5. if (empty) return <EmptyState />
  // 6. Main render
}
```

- Dynamic routes: `useLocalSearchParams<{ id: string }>()`
- Modals: `presentation: 'modal'` in Stack.Screen options
- Navigation: `const { push, back, replace } = useRouter()`

---

## Data Layer

See `docs/architecture.md` for hook patterns, service patterns, and API client setup.

**Key rules:**
- TanStack Query for all server data (`useQuery`, `useInfiniteQuery`, `useMutation`)
- Service functions in `services/` — components never call `fetch()` directly
- Optimistic updates via `onMutate` + rollback on `onError`
- Query keys: `['entity']` for lists, `['entity', id]` for detail
- Public endpoints: `authenticated: false`

---

## Rendering Safety (CRITICAL — crashes in production)

```tsx
// CRASH: {count && <C />} when count=0 → renders "0" outside <Text>
// FIX:  {count ? <C /> : null}  or  {!!count && <C />}

// CRASH: <View>Hello</View> → bare string outside <Text>
// FIX:  <View><Text>Hello</Text></View>
```

---

## Performance

> Vercel `react-native-skills` has detailed code examples for all of these. Follow them.

- **FlatList:** Always set `keyExtractor`, `getItemLayout`, `removeClippedSubviews`, `maxToRenderPerBatch={10}`, `windowSize={5}`
- **List items:** Lightweight — no queries, no context, pass primitives, hoist callbacks, no inline objects
- **Images:** `expo-image` only (not `react-native` Image)
- **Animations:** Only `transform` + `opacity` (GPU). Never width/height/margin.
- **React Compiler:** No `memo()`/`useCallback()`/`useMemo()`. Destructure hook returns early (`const { push } = useRouter()`). Use `.get()`/`.set()` for Reanimated shared values.
- **State:** Minimal source of truth. Derive values. Never store scroll position in `useState`.

---

## Accessibility

- Every `Pressable` needs `accessibilityRole` + `accessibilityLabel`
- Touch targets: min 44×44pt iOS, 48×48dp Android. Use `hitSlop` for small elements.
- Images: always `accessibilityLabel`

---

## Safe Area

```tsx
const insets = useSafeAreaInsets();
// Bottom bar: { paddingBottom: insets.bottom + Spacing.md }
// ScrollView: contentInsetAdjustmentBehavior="automatic"
```

---

## Localization

Romanian only. All strings in `constants/localization.ts` — never inline.

---

## Icon System

1. SF Symbol name → MaterialIcons mapping in `components/ui/icon-symbol.tsx`
2. Sizes: tab=28, inline=16-20, card=24, header=24, empty=48-64

---

## Auth

Progressive model — browse without login, modal auth on protected actions:

```tsx
const { session, requireAuth } = useAuth();
<Pressable onPress={() => requireAuth(() => vote(id))} />
```

---

## Error Handling

- Services throw `ApiError(status, message, requestId)`
- Screens: TanStack Query handles loading/error/empty states
- Never swallow errors — log, display, or re-throw

---

## Git Workflow

- Branch: `feat/S{nn}-short-name` (also `fix/`, `refactor/`, `docs/`)
- Commits: `type(scope): description` — English, conventional commits
- PR: `Closes #N` → HITL review → merge → update story status

---

## Verification Checklist

```bash
npx tsc --noEmit    # zero errors
npm run lint         # zero warnings
```

- [ ] Light + dark mode
- [ ] No hardcoded colors/spacing/strings
- [ ] Loading, error, empty states handled
- [ ] Touch targets ≥ 44pt/48dp
- [ ] `@/` imports, `StyleSheet.create()`, types from OpenAPI

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| `../` imports | `@/` path alias |
| `React.memo()` / `useCallback` / `useMemo` | React Compiler handles it |
| `router.push()` | Destructure: `const { push } = useRouter()` |
| `sharedValue.value` | `.get()` / `.set()` |
| Inline style objects | `StyleSheet.create()` |
| Hardcoded colors / spacing / strings | Tokens: `Colors`, `Spacing`, `localization.ts` |
| `{count && <C />}` | **CRASH.** Use `{count ? <C /> : null}` |
| Bare strings in `<View>` | **CRASH.** Wrap in `<Text>` |
| `TouchableOpacity` | `Pressable` |
| Animate width/height/margin | `transform` + `opacity` only |
| Scroll in `useState` | Reanimated `useSharedValue` |
| Query in list item | Fetch in parent, pass primitives |
| Inline objects in `renderItem` | Hoist or `StyleSheet` |
| `.map()` before FlatList | Stable refs — transform inside items |
| Boolean prop proliferation | Compound components |
| `any` / `as Type` / `!` assertion | Type narrow properly |
| `useEffect` + `fetch` | TanStack Query |
| `react-native` Image | `expo-image` |
| Swallow errors in catch | Log, display, or re-throw |
| `AsyncStorage` for tokens | `expo-secure-store` |
| Default export for components | Named export (default = screens only) |
| Array index as key | Stable `item.id` |
| `Dimensions.get()` | `useWindowDimensions()` |
| `console.log` | Remove or `__DEV__` guard |
