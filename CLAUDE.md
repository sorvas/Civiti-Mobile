# Civiti-Mobile

Expo 54 / React Native 0.81 mobile app with Expo Router file-based routing.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
npm run web        # Start web dev server
npm run lint       # ESLint (flat config via expo lint)
```

## Architecture

```
app/                  # Expo Router file-based routing
  _layout.tsx         # Root layout (providers, Stack)
  (tabs)/             # Tab navigation group (4 tabs)
    _layout.tsx       # Tab navigator config with auth gating
    index.tsx         # Probleme — issues list (/)
    create.tsx        # Creează — create wizard (/create)
    my-issues.tsx     # Ale mele — user's issues (/my-issues)
    profile.tsx       # Profil — user profile (/profile)
  (auth)/             # Auth modal stack (presentation: 'modal')
    _layout.tsx       # Auth stack config
    login.tsx         # Login screen (/login)
  issues/
    [id].tsx          # Issue detail (placeholder — S09)
components/           # Reusable UI components
  ui/                 # Lower-level UI primitives
  issue-card.tsx      # Issue list card (photo, badges, meta)
  issue-card-skeleton.tsx # Card-shaped loading placeholder
constants/
  theme.ts            # Colors (light/dark) and font families
hooks/                # Custom hooks (useColorScheme, useThemeColor, useIssues, useCategories)
utils/                # Pure utility functions (colors, formatTimeAgo)
assets/images/        # App icons, splash, logos
```

## Key Patterns

- **Themed components**: `ThemedText` and `ThemedView` accept `lightColor`/`darkColor` props, use `useThemeColor` hook
- **Platform-specific files**: `.ios.tsx` suffix for iOS-only implementations (e.g., `icon-symbol.ios.tsx` uses SF Symbols, default uses MaterialIcons)
- **Styling**: `StyleSheet.create()` — no Tailwind/NativeWind configured
- **Animations**: `react-native-reanimated` for complex animations (parallax scroll, wave)
- **Navigation icons**: Use SF Symbol names (e.g., `'house.fill'`) — mapped to MaterialIcons on Android/web

## Configuration

- **New Architecture**: enabled (`newArchEnabled: true`)
- **Typed Routes**: enabled (`experiments.typedRoutes: true`)
- **React Compiler**: enabled (`experiments.reactCompiler: true`)
- **TypeScript**: strict mode, path alias `@/*` → project root
- **Deep linking scheme**: `civitimobile`
- **Orientation**: portrait only

## Documentation

- **PRD**: `PRD.md` — full product requirements with screen specs, flows, and API mappings. Read this for product context.
- **Agent guidelines**: `docs/agents.md` — code style rules, patterns, and common mistakes for AI agents. **Read this before writing any code.**
- **Architecture**: `docs/architecture.md` — folder structure, navigation, API layer, state management, auth flow, types strategy.
- **Design system**: `docs/design-system.md` — brand colors, typography (Fira Sans), spacing scale, component patterns, dark mode.
- **API quick reference**: `docs/api-reference.md` — compact index of all 49 endpoints. Read this first to find the endpoint you need.
- **API full spec**: `docs/openapi.json` — complete OpenAPI 3.0.4 spec. Grep by `operationId` or path for full schemas.
- **Implementation plan**: `docs/implementation-plan.md` — 24 sequenced stories with dependencies, acceptance criteria, and status tracking. Each story = 1 GitHub issue = 1 PR.

### API Basics

- **Auth**: JWT Bearer token via Supabase Auth
- **Base URL**: `https://civiti-server-production.up.railway.app/api` (configurable per environment)
- **State management**: TanStack Query for server data, React Context for auth

## Gotchas

- Import `react-native-reanimated` early (done in root `_layout.tsx`) before other navigation imports
- `useColorScheme` has a web-specific variant (`.web.ts`) to handle SSR hydration mismatch
- `IconSymbol` maps SF Symbol names to MaterialIcons — add new mappings in `components/ui/icon-symbol.tsx` when adding icons
- `npm run reset-project` destructively moves `app/` to `app-example/` and creates a blank app
