# Implementation Plan

24 sequenced stories. Each story = 1 GitHub issue = 1 branch = 1 PR.

> **Workflow**: Pick next `pending` → branch `feat/S{nn}-short-name` → implement → PR → review → merge → mark `done`

## Issue Map

| Story | Issue | Title | Depends | Status |
|---|---|---|---|---|
| S01 | [#1](https://github.com/sorvas/Civiti-Mobile/issues/1) | Project cleanup & design tokens | — | `pending` |
| S02 | [#2](https://github.com/sorvas/Civiti-Mobile/issues/2) | UI primitives | S01 | `pending` |
| S03 | [#3](https://github.com/sorvas/Civiti-Mobile/issues/3) | API client & service layer | S01 | `pending` |
| S04 | [#4](https://github.com/sorvas/Civiti-Mobile/issues/4) | Auth context & Supabase setup | S03 | `pending` |
| S05 | [#5](https://github.com/sorvas/Civiti-Mobile/issues/5) | Navigation shell & tab bar | S04 | `pending` |
| S06 | [#6](https://github.com/sorvas/Civiti-Mobile/issues/6) | Issues list — card view | S02,S03,S05 | `pending` |
| S07 | [#7](https://github.com/sorvas/Civiti-Mobile/issues/7) | Issues list — filter sheet | S06 | `pending` |
| S08 | [#8](https://github.com/sorvas/Civiti-Mobile/issues/8) | Issues list — map view | S06 | `pending` |
| S09 | [#9](https://github.com/sorvas/Civiti-Mobile/issues/9) | Issue detail screen | S06 | `pending` |
| S10 | [#10](https://github.com/sorvas/Civiti-Mobile/issues/10) | Email campaign flow | S09 | `pending` |
| S11 | [#11](https://github.com/sorvas/Civiti-Mobile/issues/11) | Login screen | S04,S05 | `pending` |
| S12 | [#12](https://github.com/sorvas/Civiti-Mobile/issues/12) | Registration flow | S11 | `pending` |
| S13 | [#13](https://github.com/sorvas/Civiti-Mobile/issues/13) | Create wizard — Steps 1 & 2 | S02,S04,S05 | `pending` |
| S14 | [#14](https://github.com/sorvas/Civiti-Mobile/issues/14) | Create wizard — Steps 3 & 4 | S13 | `pending` |
| S15 | [#15](https://github.com/sorvas/Civiti-Mobile/issues/15) | Create wizard — Step 5 (Review) | S14 | `pending` |
| S16 | [#16](https://github.com/sorvas/Civiti-Mobile/issues/16) | My Issues (Tab 3) | S06,S04 | `pending` |
| S17 | [#17](https://github.com/sorvas/Civiti-Mobile/issues/17) | Profile & gamification (Tab 4) | S02,S04 | `pending` |
| S18 | [#18](https://github.com/sorvas/Civiti-Mobile/issues/18) | Profile sub-screens | S17 | `pending` |
| S19 | [#19](https://github.com/sorvas/Civiti-Mobile/issues/19) | Comments system | S09 | `pending` |
| S20 | [#20](https://github.com/sorvas/Civiti-Mobile/issues/20) | Activity feed | S06 | `pending` |
| S21 | [#21](https://github.com/sorvas/Civiti-Mobile/issues/21) | Onboarding slides | S05 | `pending` |
| S22 | [#22](https://github.com/sorvas/Civiti-Mobile/issues/22) | Offline draft saving | S15 | `pending` |
| S23 | [#23](https://github.com/sorvas/Civiti-Mobile/issues/23) | Push notifications | S04 | `pending` |
| S24 | [#24](https://github.com/sorvas/Civiti-Mobile/issues/24) | Dark mode & final polish | all | `pending` |

## Status Legend

`pending` · `in-progress` · `in-review` · `done` · `blocked`

## Dependency Graph

```
S01 ──┬── S02 ──┐
      │         ├── S06 ── S07, S08, S09 ── S10, S19
      ├── S03 ──┤                    S20
      │         │
      └── S04 ──┼── S05 ── S06, S11 ── S12, S21
                ├── S13 ── S14 ── S15 ── S22
                ├── S16, S17 ── S18, S23
S24 depends on all
```

## Story Details

> **For each story**: Full scope & acceptance criteria are in the linked GitHub issue. Below is the summary for agent context.

---

### Phase 1 — Foundation (S01–S05)

**S01 · Design tokens** — Remove boilerplate. Create `constants/theme.ts` (brand colors), `spacing.ts`, `localization.ts`, `enums.ts`, `api.ts`, `.env.example`. Load Fira Sans. Update ThemedText variants. Done: lint+tsc pass, app launches with Fira Sans, no boilerplate remains.

**S02 · UI primitives** — Build: button (4 variants), text-input (error state), status-badge, category-badge, urgency-badge, chip-selector, progress-bar, avatar, empty-state, error-state, loading-skeleton. Update icon-symbol mappings. Done: all render light+dark, lint+tsc pass.

**S03 · API client & service layer** — Install `@tanstack/react-query`. Create: `services/errors.ts`, `services/api-client.ts`, `store/query-client.tsx`, all `types/*` files (from openapi.json), all `services/*` files. Done: tsc pass, services match OpenAPI signatures, apiClient handles auth+errors.

**S04 · Auth context & Supabase** — Install `@supabase/supabase-js`, `expo-secure-store`, `react-native-url-polyfill`. Create: `services/auth.ts`, `store/auth-context.tsx`. Wire apiClient to Supabase session. Update root layout with provider stack. Done: `useAuth()` returns session+requireAuth, apiClient attaches Bearer token.

**S05 · Navigation shell** — Create 4-tab layout (Probleme, Creează, Ale mele, Profil), `(auth)` modal stack, placeholder screens, root Stack config. Auth gate protected tabs. Done: tabs render with correct icons/colors, protected tabs show login modal, lint+tsc pass.

---

### Phase 2 — Core Screens (S06–S10)

**S06 · Issues list (cards)** — Create `issue-card.tsx`, `hooks/use-issues.ts` (infinite query, 12/page), `hooks/use-categories.ts`. Implement Tab 1: FlatList with cards, infinite scroll, pull-to-refresh, loading/empty/error states. Card tap → issue detail.

**S07 · Filter sheet** — Install `@gorhom/bottom-sheet`. Create `filter-sheet.tsx`: category chips, urgency chips, status chips, sort radio. Filter icon with active count badge. Params pass to `useIssues`.

**S08 · Map view** — Install `react-native-maps`. Segmented toggle card/map. Map centered on Bucharest, pins by category color. `issue-mini-card.tsx` on pin tap. Filters apply to both views.

**S09 · Issue detail** — Create `photo-gallery.tsx`, `vote-button.tsx`, `hooks/use-issue-detail.ts`, `hooks/use-vote.ts` (optimistic). Implement `issues/[id].tsx`: photo carousel, badges, stats, description, location map, authorities, sticky bottom bar (vote + email CTA). Share button.

**S10 · Email campaign** — Create `authority-card.tsx`, `email-prompt.tsx`, `hooks/use-email-tracking.ts`. Construct `mailto:` with Romanian template. Open native email → return → prompt "Ai trimis?" → track via API → points toast.

---

### Phase 3 — Auth Screens (S11–S12)

**S11 · Login** — Google OAuth + Apple Sign-In (iOS) + email/password. Error display. Success dismisses modal. Links to register/forgot-password. Handle OAuth redirect.

**S12 · Registration** — Step 1: account (email/password or OAuth + display name + terms). Step 2: profile (district dropdown, residence type, notifications) → `POST /api/user/profile`. Forgot/reset password screens.

---

### Phase 4 — Issue Creation (S13–S15)

**S13 · Wizard steps 1-2** — Install `expo-image-picker`, `expo-image-manipulator`. Wizard state store. Progress dots. Step 1: category grid from API. Step 2: camera/gallery, photo grid, compress+upload to Supabase Storage. Min 1, max 5.

**S14 · Wizard steps 3-4** — Step 3: title, description (min 50), urgency segmented, outcome/impact textareas, address+map picker, AI enhance button. Step 4: authority list filtered by district, custom authority add, selected count.

**S15 · Wizard step 5 (Review)** — Read-only summary of all data. "Trimite problema" → `POST /api/issues` → success+confetti → My Issues. "Salvează ca ciornă" to AsyncStorage. Draft resume prompt on launch.

---

### Phase 5 — User Screens (S16–S18)

**S16 · My Issues** — Segmented: Toate/Active/Rezolvate/Respinse. Issue cards with status badge + admin feedback. Edit action. Empty state CTA. Edit screen: pre-filled form, save, resubmit toggle.

**S17 · Profile & gamification** — Profile header (avatar, name, level, points). Level progress bar. 2×2 stats grid. Recent badges horizontal scroll. Active achievements top 3. Quick actions: edit profile, leaderboard, settings, logout.

**S18 · Profile sub-screens** — Badges collection grid. Achievements list with progress. Leaderboard (period+category filters, top 3 podium, ranked list). Edit profile form. Settings (notification toggles, delete account).

---

### Phase 6 — Social (S19–S20)

**S19 · Comments** — Inline on issue detail. Sort newest/most helpful. Paginated. Sticky input bar. Reply mode. Edit/delete own. Helpful vote toggle.

**S20 · Activity feed** — `GET /api/activity`. Activity items with type icon, message, issue link, timeAgo. On home screen alongside issues.

---

### Phase 7 — Polish (S21–S24)

**S21 · Onboarding** — 3 slides (Oxford Blue bg, white text), page dots, skip link, AsyncStorage flag. First launch only.

**S22 · Offline drafts** — Auto-save wizard to AsyncStorage per step. Resume prompt on launch. Manual save on Step 5.

**S23 · Push notifications** — `expo-notifications`. Register token. Handle: issue approved/rejected → detail, comment → detail, achievement → profile. Tab badge. Respect notification prefs. May be `blocked` if backend endpoint unavailable.

**S24 · Dark mode & polish** — Audit all screens for dark mode. Fix hardcoded colors. Verify states, touch targets, safe areas, portrait lock, FlatList performance.

---

## Phase Summary

| Phase | Stories | Scope |
|---|---|---|
| 1 Foundation | S01–S05 | Tokens, primitives, API, auth, navigation |
| 2 Core | S06–S10 | Issues list, filters, map, detail, email |
| 3 Auth | S11–S12 | Login, registration |
| 4 Creation | S13–S15 | 5-step wizard |
| 5 User | S16–S18 | My Issues, profile, gamification, settings |
| 6 Social | S19–S20 | Comments, activity |
| 7 Polish | S21–S24 | Onboarding, drafts, push, dark mode |
| **Total** | **24** | |
