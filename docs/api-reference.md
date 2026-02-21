# Civiti API — Quick Reference

> For full schemas: grep `docs/openapi.json` by `operationId`, path, or schema name.
> **Auth**: JWT Bearer via Supabase. **Base URL**: per environment config.

## Endpoints by Tag

### Activity
| Method | Path | operationId | Auth |
|---|---|---|---|
| GET | `/api/activity` | `GetRecentActivities` | No |
| GET | `/api/activity/my` | `GetUserActivities` | Yes |

Query: `page`, `pageSize`, `type` (ActivityType), `since` (datetime)

### Admin (web-only, excluded from mobile)
`GET /api/admin/actions` · `POST /api/admin/bulk-approve` · `GET /api/admin/issues/{id}` · `PUT .../approve` · `PUT .../reject` · `PUT .../request-changes` · `GET /api/admin/moderation-stats` · `GET /api/admin/pending-issues` · `GET /api/admin/statistics`

### Authentication
| GET | `/api/auth/status` | `GetAuthStatus` | Yes |

### Authorities
| GET | `/api/authorities` | `GetAuthorities` | No |
| GET | `/api/authorities/{id}` | `GetAuthorityById` | No |

Query (list): `city`, `district`, `search`

### Comments
| Method | Path | operationId | Auth |
|---|---|---|---|
| GET | `/api/issues/{issueId}/comments` | `GetIssueComments` | No |
| POST | `/api/issues/{issueId}/comments` | `CreateComment` | Yes |
| GET | `/api/comments/{id}` | `GetComment` | No |
| PUT | `/api/comments/{id}` | `UpdateComment` | Yes |
| DELETE | `/api/comments/{id}` | `DeleteComment` | Yes |
| POST | `/api/comments/{id}/vote` | `VoteCommentHelpful` | Yes |
| DELETE | `/api/comments/{id}/vote` | `RemoveCommentVote` | Yes |

Query (list): `page`, `pageSize`, `sortBy`, `sortDescending`

### Gamification
| GET | `/api/gamification/achievements` | `GetAllAchievements` | No |
| GET | `/api/gamification/achievements/user` | `GetUserAchievements` | Yes |
| GET | `/api/gamification/badges` | `GetAllBadges` | No |
| GET | `/api/gamification/badges/user` | `GetUserBadges` | Yes |
| GET | `/api/gamification/leaderboard` | `GetGamificationLeaderboard` | Yes |

Query (leaderboard): `period`, `category`, `limit`

### Health
| GET | `/api/health` | `HealthCheck` | No |

### Issues
| Method | Path | operationId | Auth |
|---|---|---|---|
| GET | `/api/issues` | `GetIssues` | No |
| POST | `/api/issues` | `CreateIssue` | Yes (rate: 10/hr) |
| GET | `/api/issues/{id}` | `GetIssueById` | No |
| POST | `/api/issues/{id}/email-sent` | `ConfirmEmailSent` | Yes (rate: 10/hr) |
| GET | `/api/issues/{id}/poster` | `GenerateIssuePoster` | No |
| POST | `/api/issues/{id}/vote` | `VoteForIssue` | Yes (rate: 10/hr) |
| DELETE | `/api/issues/{id}/vote` | `RemoveVoteFromIssue` | Yes |
| POST | `/api/issues/enhance-text` | `EnhanceText` | Yes (rate: 10/hr) |

Query (list): `page`, `pageSize`, `category`, `urgency`, `status`, `district`, `address`, `sortBy`, `sortDescending`

### JWKS (internal, not used by mobile)
`POST .../cache/clear` · `POST .../cache/refresh` · `GET .../health` · `GET .../stats`

### User
| Method | Path | operationId | Auth |
|---|---|---|---|
| DELETE | `/api/user/account` | `DeleteUserAccount` | Yes |
| GET | `/api/user/gamification` | `GetUserGamification` | Yes |
| GET | `/api/user/issues` | `GetUserIssues` | Yes |
| PUT | `/api/user/issues/{id}` | `UpdateUserIssue` | Yes |
| PUT | `/api/user/issues/{id}/status` | `UpdateUserIssueStatus` | Yes |
| GET | `/api/user/leaderboard` | `GetLeaderboard` | Yes |
| GET | `/api/user/profile` | `GetUserProfile` | Yes |
| POST | `/api/user/profile` | `CreateUserProfile` | Yes |
| PUT | `/api/user/profile` | `UpdateUserProfile` | Yes |

Query (issues): `page`, `pageSize`, `status`, `sortBy`, `sortDescending`
Query (leaderboard): `page`, `pageSize`, `period`

### Utility
| GET | `/api/categories` | `GetCategories` | No |

---

**Total**: 49 endpoints · 11 tags · Spec version: v1
