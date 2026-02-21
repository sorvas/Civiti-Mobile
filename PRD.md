# Civiti Mobile — PRD

**v1.0** · iOS & Android · React Native + Expo

## Overview

Civic engagement platform for Romanian citizens to pressure local authorities through coordinated email campaigns. Mobile app = full citizen feature parity with web (civiti.ro). Admin stays web-only. Same .NET backend on Railway.

**Core flows**: Browse issues → vote → send emails to authorities → create new issues → track gamification progress.

## Goals & Non-Goals

**Goals**: Native mobile UX, camera-first issue creation, native `mailto:` for email campaigns, push notifications, offline draft saving, Bucharest only (MVP).

**Non-goals**: Admin dashboard, web replacement, direct email sending, real-time chat, multi-city.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Expo 54 / React Native 0.81 |
| Navigation | Expo Router (file-based, tabs) |
| State | TanStack Query (server) + React Context (auth) |
| Auth | Supabase Auth (Google, Apple, email+password) |
| Maps | `react-native-maps` |
| Camera | `expo-image-picker` + `expo-image-manipulator` |
| Push | `expo-notifications` |
| Storage | `expo-secure-store` (auth) + AsyncStorage (drafts) |

**Backend**: `https://civiti-server-production.up.railway.app/api` · Supabase Storage for photos.

## Navigation

4 tabs: **Probleme** (issues list) · **Creează** (5-step wizard) · **Ale mele** (my issues) · **Profil** (profile+gamification)

Auth screens as modal stack. Issue detail, leaderboard, badges, achievements, settings, edit-profile as root stack screens.

**Progressive auth**: Tab 1 public. Tabs 2-4 + actions (vote, comment, email) require auth → login modal → dismiss → resume.

---

## Screen Specs

### Issues List (Tab 1)

**Header**: "Probleme în București" with filter icon (top-right). Badge on icon shows active filter count.

**View toggle**: Segmented control below header — Card list (default) | Map view.

**Card list view** — FlatList, infinite scroll (12/page), pull-to-refresh. Each card:
- Photo (full-width, 180px height, `contentFit="cover"`, rounded top corners)
- Category badge (top-left overlay on photo)
- Urgency badge (top-right overlay, color-coded)
- Title (H3, 2-line max with ellipsis)
- Address (caption, 1-line with ellipsis, 📍 prefix)
- Bottom row: `📧 {emailsSent} emailuri` · `👥 {communityVotes} voturi` · `{timeAgo}`
- Status badge shown for non-Active statuses
- Tap → navigates to Issue Detail

**Map view**:
- Full-screen map centered on Bucharest (44.4268°N, 26.1025°E)
- Issue pins color-coded by category (see design-system.md Category Colors)
- Tap pin → mini-card overlay at bottom (photo thumbnail, title, category, address)
- Tap mini-card → navigates to Issue Detail
- Filters from bottom sheet apply to map pins too

**Default state**: Active issues, newest first (`sortBy: 'date'`, `sortDescending: true`).

**Empty state**: "Nu sunt probleme active în zona ta" with CTA button to create (Tab 2).

**Filter bottom sheet** (slides up, half-screen, expandable):
- **Categorie**: Horizontal chip multi-select — values from `GET /api/categories`
- **Urgență**: Chips — Scăzută, Medie, Ridicată, Urgentă
- **Status**: Chips — Activ, Rezolvat
- **Sortare**: Radio group — Cele mai noi, Cele mai vechi, Cele mai susținute, Cele mai urgente
- "Aplică filtre" primary CTA + "Resetează" text button

**API**: `GET /api/issues` with `page`, `pageSize`, `category`, `urgency`, `status`, `sortBy`, `sortDescending`

---

### Issue Detail

Scrollable stacked layout with **sticky bottom action bar**.

**Sections** (top to bottom):
1. **Photo carousel** — Horizontal swipeable, full-width, 250px height, page dots. Tap opens fullscreen gallery viewer.
2. **Title + Meta** — Title (H1), status badge, category badge, urgency badge. `{timeAgo}` · `de {submitterName}`.
3. **Statistics row** — Three columns: `{emailsSent} Emailuri` | `{communityVotes} Voturi` | `{authorities.length} Autorități`
4. **Description** — Full description text
5. **Desired Outcome** — Section header + text (only shown if `desiredOutcome` is present)
6. **Community Impact** — Section header + text (only shown if `communityImpact` is present)
7. **Location** — Static map preview (200px height) with pin at `latitude`/`longitude`. Address text below. Tap opens in native maps app (Apple Maps / Google Maps).
8. **Authorities** — List of authorities, each showing: name, email, "Trimite email" button (see Email Campaign Flow)
9. **Comments** — Inline section (see Comments System below)

**Sticky bottom bar**:
- **Left**: Vote button — heart icon + `{communityVotes}` count. Filled heart if `hasVoted`, outline if not. Tap toggles vote with optimistic UI (spring animation 1.0→1.3→1.0). Calls `POST /api/issues/{id}/vote` or `DELETE` to remove. Requires auth.
- **Right**: "Trimite Email" primary CTA — scrolls to authority section or opens email flow if single authority.

**Share button**: Top-right header action. Opens OS share sheet with: `"Ajută-ne să rezolvăm: {title}\n{description (truncated)}\nhttps://civiti.ro/issue/{id}"`

**API**: `GET /api/issues/{id}` → `IssueDetailResponse`, `GET /api/issues/{id}/comments` → paginated

---

### My Issues (Tab 3)

**Segmented control**: Toate | Active | Rezolvate | Respinse (maps to `status` query param)

Each card same as Issues List but with:
- Status badge prominently displayed (always visible, not just non-Active)
- Admin feedback indicator: shows icon/text if admin left a `rejectionReason` or requested changes
- "Editează" action button for editable statuses (Draft, Submitted, Rejected — not Active/Resolved/Cancelled)

**Empty state**: Illustration + "Nu ai creat încă nicio problemă" + CTA button → Tab 2 (Create).

**API**: `GET /api/user/issues` with `status`, `page`, `pageSize`, `sortBy`, `sortDescending`

### Edit Issue

Pre-filled form:
- Title input
- Description textarea
- Photo management (add new / remove existing)
- "Salvează modificările" submit button → `PUT /api/user/issues/{id}`
- "Retrimite pentru aprobare" toggle — when enabled, changes status back to `Submitted` via `PUT /api/user/issues/{id}/status`

---

### Profile (Tab 4)

Scrollable single view:

1. **Profile header** — Avatar (circular, fallback initials), display name, email, level badge, total points
2. **Level progress bar** — Shows `pointsInCurrentLevel / nextLevelPoints`. Label: "Nivel {level}". Bar fills to `levelProgressPercentage`%.
3. **Stats grid** (2×2):
   - Probleme create (`issuesReported`)
   - Probleme rezolvate (`issuesResolved`)
   - Voturi comunitate (`communityVotes`)
   - Emailuri trimise (from gamification data)
4. **Recent badges** — Horizontal scroll of `recentBadges` (max 5 shown). Each: icon, `nameRo`, greyed if `!isEarned`. "Vezi toate →" link → `/badges`.
5. **Active achievements** — Top 3 `activeAchievements` with progress bar (`progress/maxProgress`) + percentage. "Vezi toate →" link → `/achievements`.
6. **Quick actions** list:
   - Editează profilul → `/edit-profile`
   - Clasament → `/leaderboard`
   - Setări notificări → `/settings`
   - Deconectare → `signOut()`, clear session, navigate to Tab 1

**API**: `GET /api/user/profile` → `UserProfileResponse`, `GET /api/user/gamification` → `UserGamificationResponse`

---

### Leaderboard

- **Period**: Segmented control — Toate timpurile | Lunar | Săptămânal
- **Category**: Chips — Puncte | Emailuri | Probleme
- **Top 3**: Podium visual (gold/silver/bronze with avatars, names, scores)
- **Ranked list**: Scrollable, each row: rank number, avatar, display name, score, level badge

**API**: `GET /api/user/leaderboard` with `period`, `category`, `limit`

### Settings / Edit Profile

**Edit profile** fields:
- Display name (text input)
- County: disabled, shows "București"
- City: disabled, shows "București"
- District: dropdown (Sector 1, Sector 2, ... Sector 6)
- Residence type: radio — Apartament | Casă | Business

**Notification preferences** (toggles, all default ON):
- Actualizări probleme (`issueUpdatesEnabled`)
- Știri comunitate (`communityNewsEnabled`)
- Digest lunar (`monthlyDigestEnabled`)
- Realizări (`achievementsEnabled`)

**Danger zone**: "Șterge contul" → confirmation dialog → `DELETE /api/user/account`

---

## Auth

**Methods**: Google OAuth, Apple Sign-In (iOS required by App Store), Email+Password — all via Supabase Auth.

### Login Screen

- Header: "Conectează-te pentru a continua"
- Google Sign-In button (Supabase OAuth)
- Apple Sign-In button (iOS only — `Platform.OS === 'ios'`)
- Email + password form with text inputs
- "Conectează-te" submit button
- "Nu ai cont? Înregistrează-te" link → register screen
- "Ai uitat parola?" link → forgot-password screen
- Error display for failed login attempts
- Success → dismiss modal, return to the action user was attempting

### Registration (2-step)

**Step 1 — Account**:
- Email + password fields, OR Google OAuth, OR Apple Sign-In
- Display name field
- Terms acceptance checkbox (required)
- "Creează cont" submit button

**Step 2 — Profile** (after account created):
- County: disabled "București"
- City: disabled "București"
- District: dropdown (Sector 1-6)
- Residence type: radio — Apartament | Casă | Business
- Notification toggles (all ON by default)
- "Finalizează" submit → `POST /api/user/profile` with `CreateUserProfileRequest`

### Forgot / Reset Password
- **Forgot**: email input → Supabase `resetPasswordForEmail`
- **Reset**: deep link target (`civitimobile://auth/reset-password`), new password form

### Token Management
`expo-secure-store` for session. JWT Bearer header on API calls. Auto-refresh via Supabase client. 401 → clear session, present login modal.

---

## Issue Creation Wizard

5-step wizard, one screen per step. Back navigation between steps. Progress indicator at top (step dots). All data persists in wizard state store across steps.

### Step 1 — Category Selection
- 2-column grid of category cards (icon + Romanian label)
- Categories from `GET /api/categories`: Infrastructură, Mediu, Transport, Servicii Publice, Siguranță, Altele
- Tap card → advances to Step 2, stores `IssueCategory`

### Step 2 — Photo Upload
- "Adaugă fotografii" area (dashed border, camera icon)
- Two buttons: "Cameră" (launch camera) | "Galerie" (pick from gallery)
- 2-column photo grid showing selected photos, each with delete button (top-right X)
- Compress: max 1920px width, JPEG 80% quality via `expo-image-manipulator`
- Upload to Supabase Storage → store `photoUrls: string[]` in wizard state
- **Min 1, max 5 photos.** Validation message if under minimum.

### Step 3 — Issue Details
- **Titlu** (text input, required)
- **Descriere** (multiline textarea, required, min 50 chars)
- **Urgență** (segmented control: Scăzută | Medie | Ridicată | Urgentă)
- **Rezultat dorit** (textarea, optional)
- **Impact asupra comunității** (textarea, optional)
- **Adresă** (text input + map pin button)
- **Locație pe hartă** — Static map preview with pin. Tap opens location picker modal.
- **"Îmbunătățește cu AI"** button → `POST /api/issues/enhance-text` with `EnhanceTextRequest` → populates enhanced title/description

**Location picker modal** (full-screen):
- Interactive map centered on Bucharest
- Tap-to-place pin or drag existing pin
- Address auto-fills from coordinates
- "Confirmă locația" button at bottom
- Stores `latitude`, `longitude`, `address`, `district`

### Step 4 — Authority Selection
- Header: "Selectează autoritățile responsabile"
- Authority list from `GET /api/authorities?city=București&district={district}`
- Each card: authority name, email address, checkbox
- "Adaugă autoritate personalizată" expandable section with name + email fields
- Selected count: "{n} autorități selectate"

### Step 5 — Review & Submit
Read-only summary:
- Category badge
- Photo thumbnails (horizontal scroll)
- Title + description
- Urgency badge
- Location map preview + address
- Desired outcome + community impact (if provided)
- Selected authorities list
- **"Trimite problema"** primary CTA (full-width, orange)
- **"Salvează ca ciornă"** secondary link

**On submit**: `POST /api/issues` with `CreateIssueRequest` → success screen ("Problema a fost trimisă!" with confetti animation) → navigate to My Issues tab.

**Draft saving**: Auto-save wizard state to AsyncStorage on each step. "Salvează ca ciornă" also writes to AsyncStorage. On next launch, if draft exists: prompt "Ai o ciornă nesalvată. Dorești să continui?" → resume at last step or clear.

---

## Email Campaign Flow

1. User taps "Trimite email" on an authority (in Issue Detail)
2. App constructs `mailto:` URI:
   - **To**: `authority.email`
   - **Subject**: `[URGENT] Sesizare cetățenească - {issue.title} - {issue.district}, București`
   - **Body**: Romanian template (see below)
3. Opens native email client via `Linking.openURL(mailto)`
4. On return to app, show prompt: "Ai trimis emailul?" (Da / Nu buttons)
5. If "Da" → `POST /api/issues/{id}/email-sent` with `{ targetAuthority: authority.email }` → show points earned toast
6. Requires auth (use `requireAuth` wrapper)

### Email Template (Romanian)
```
Stimată {authority.name},

Vă scriu pentru a vă aduce la cunoștință o problemă comunitară care necesită atenția dumneavoastră.

Detalii problemă:
- Titlu: {issue.title}
- Locație: {issue.address}
- Categorie: {issue.category}
- Urgență: {issue.urgency}

Descriere:
{issue.description}

Rezultat dorit:
{issue.desiredOutcome}

Impact asupra comunității:
{issue.communityImpact}

Această problemă a fost raportată pe {issue.createdAt} și a fost deja semnalată de {issue.emailsSent} cetățeni.

Vă rog să interveniți pentru rezolvarea acestei situații.

Cu stimă,
{user.displayName}

---
Referință: {issue.id}
Trimis prin platforma Civiti
```

---

## Comments System

Inline on Issue Detail screen, below all issue content.

**Layout**:
- Section header: "Comentarii ({totalCount})"
- Sort toggle: Cele mai noi | Cele mai utile
- Comment list (flat, not deeply nested):
  - Avatar + display name + level badge + timeAgo
  - Comment text
  - "Util" button (heart/thumbs-up) with `helpfulCount` — toggles via `POST/DELETE /api/comments/{id}/vote`
  - "Răspunde" button
  - Reply indicator for replies: `↳ Răspuns la {parentAuthorName}`
  - Edit/Delete actions visible only for user's own comments
- Paginated: "Încarcă mai multe comentarii" button at bottom

**Sticky input bar** (bottom of screen, above tab bar):
- Text input: "Adaugă un comentariu..."
- Send button (orange, enabled when text is non-empty)
- When replying: "Răspunzi la {name}" chip with X cancel button

**API**: `GET /api/issues/{issueId}/comments` (paginated), `POST .../comments` (create), `PUT /api/comments/{id}` (update), `DELETE /api/comments/{id}`, `POST /api/comments/{id}/vote` (helpful), `DELETE .../vote`

---

## Gamification Data

`UserGamificationResponse`: points, level, issuesReported, issuesResolved, communityVotes, currentLoginStreak, longestLoginStreak, recentBadges[], activeAchievements[], currentLevelPoints, nextLevelPoints, pointsToNextLevel, pointsInCurrentLevel, levelProgressPercentage.

`BadgeResponse`: nameRo, descriptionRo, categoryRo, rarityRo, iconUrl, isEarned, earnedAt.

`AchievementProgressResponse`: titleRo, descriptionRo, progress, maxProgress, percentageComplete, rewardPoints, completed, completedAt.

`LeaderboardEntry`: rank, displayName, points, level, emailsSent, issuesCreated, badgeCount.

Periods: `'all-time' | 'monthly' | 'weekly'`. Categories: `'points' | 'emails' | 'issues'`.

---

## Notifications

| Event | Trigger | Navigate to |
|---|---|---|
| Issue approved | Admin approves | Issue detail |
| Issue rejected | Admin rejects (with reason) | Issue detail |
| Changes requested | Admin requests changes | Issue detail |
| Issue resolved | Marked resolved | Issue detail |
| New supporters | Threshold: 5, 10, 25, 50, 100 emails | Issue detail |
| New comment | Someone comments on user's issue | Issue detail |
| Achievement unlocked | User earns achievement | Profile |
| Badge earned | User earns badge | Profile |

**Prefs** (4 toggles): `issueUpdatesEnabled`, `communityNewsEnabled`, `monthlyDigestEnabled`, `achievementsEnabled`.

**Implementation**: Register device token via `expo-notifications`. Backend sends via Expo Push API / FCM. Deep link on tap navigates to relevant screen.

---

## Offline & Sharing

**Drafts**: Auto-save wizard to AsyncStorage per step. Resume prompt on launch. No offline reading cache (MVP).

**Share**: `"Ajută-ne să rezolvăm: {title}\n{description (truncated)}\nhttps://civiti.ro/issue/{id}"` via OS share sheet. Share button on Issue Detail header.

## Onboarding (first launch)

3 full-screen slides, Oxford Blue background, white text, page dots indicator:
1. "Descoperă problemele din comunitatea ta" — browse issues in your area
2. "Trimite emailuri autorităților" — join coordinated email campaigns
3. "Fă diferența împreună" — vote, comment, track progress. CTA: "Începe" → Issues List

"Sari peste" skip link (top-right). AsyncStorage flag, shown once.

## Romanian Localization Constants

```
URGENCY: unspecified→Nespecificat, low→Scăzută, medium→Medie, high→Ridicată, urgent→Urgentă
STATUS: Draft→Ciornă, Submitted→Trimisă, UnderReview→În Evaluare, Active→Activă, Resolved→Rezolvată, Rejected→Respinsă, Cancelled→Anulată
USER_FACING: Activ, Rezolvat, Respins
```

## Platform Requirements

**iOS**: 15+, Apple Sign-In required, Apple Maps, `NSCameraUsageDescription` + `NSPhotoLibraryUsageDescription` + `NSLocationWhenInUseUsageDescription`, APNs.
**Android**: API 29+, Google Maps (API key), `CAMERA` + `READ_MEDIA_IMAGES` + `ACCESS_FINE_LOCATION`, FCM.
**Build**: EAS Build, EAS Update (OTA), TestFlight + Internal Testing Track.

## API Types Reference

**Enums**: `IssueStatus` (Unspecified, Draft, Submitted, UnderReview, Active, Resolved, Rejected, Cancelled), `IssueCategory` (Infrastructure, Environment, Transportation, PublicServices, Safety, Other), `UrgencyLevel` (Unspecified, Low, Medium, High, Urgent), `ResidenceType` (Apartment, House, Business), `LeaderboardPeriod` (all-time, monthly, weekly), `LeaderboardCategory` (points, emails, issues).

**Key requests**: `CreateIssueRequest`, `CreateUserProfileRequest`, `UpdateUserProfileRequest`, `TrackEmailRequest`, `EnhanceTextRequest`, `CreateCommentRequest`, `UpdateCommentRequest`, `IssueQueryParams`.

**Key responses**: `IssueListResponse`, `IssueDetailResponse`, `UserProfileResponse`, `UserGamificationResponse`, `LeaderboardResponse`, `CommentResponse`, `BadgeResponse`, `AchievementProgressResponse`, `PagedResult<T>`.

Full schemas in `docs/openapi.json`. Grep by operationId or schema name.

## Web-to-Mobile Screen Mapping

| Web Route | Mobile | Notes |
|---|---|---|
| `/` `/location` | Removed | Bucharest hardcoded |
| `/issues` | Tab 1 | Card+map toggle |
| `/issue/:id` | `issues/[id]` | Sticky action bar |
| `/auth/*` | `(auth)/*` modal | Login, register (2-step), forgot/reset |
| `/create-issue/*` | Tab 2 wizard | 5 steps |
| `/dashboard` | Tab 4 | Gamification in profile |
| `/my-issues` | Tab 3 | Status filters |
| `/edit-issue/:id` | `issues/[id]/edit` | Resubmit option |

**Excluded (admin)**: `/admin`, `/admin/dashboard`, `/admin/approval`, `/admin/activity`
