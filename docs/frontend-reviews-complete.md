# Frontend Integration Doc: Reviews (Complete)

This document covers the full reviews feature for frontend.

Base API prefix: `/api/v1`

## 1) Scope

Included:

- Create booking review (user->provider or provider->user)
- List provider public reviews
- Provider review stats
- Helpful toggle
- Report review
- Provider response to review
- Admin moderation endpoints for reported reviews

Excluded:

- Booking lifecycle itself (covered in booking doc)
- Media upload API details (reviews currently accept `photo_urls` as direct URLs)

## 2) Enums and Values

### `ReviewType`

- `provider`
- `user`

### `ReviewStatus`

- `pending`
- `published`
- `hidden`
- `deleted`

### `ReportReason`

- `inappropriate`
- `spam`
- `offensive`
- `fake`
- `irrelevant`
- `personal_info`
- `other`

## 3) Review Lifecycle

## 3.1 Create review state

When a review is created:

- Initial status is `pending`
- `auto_publish_at` is set to now + 14 days
- `is_verified_booking = true`

If counterpart review already exists in `pending` for same booking (other side), both are immediately published:

- both statuses -> `published`
- both get `published_at`
- both clear `auto_publish_at`

Important frontend implication:

- Right after submit, review may still be `pending` and not visible in provider public list until counterpart or auto-publish job publishes it.

## 3.2 Visibility rules in public provider list

`GET /reviews/provider/{provider_id}` returns only:

- `review_type = provider`
- `status = published`
- `is_hidden = false`

So hidden/deleted/pending reviews are not visible there.

## 4) User-Facing Endpoints

## 4.1 Create Review

Endpoint:

- `POST /reviews`

Auth:

- Required (`get_current_user`)

Request (`CreateReviewRequest`):

```json
{
  "booking_id": 501,
  "overall_rating": 4.5,
  "communication_rating": 5,
  "cleanliness_rating": 4,
  "accuracy_rating": 4.5,
  "location_rating": 4,
  "value_rating": 4.5,
  "comment": "Great experience and clear communication.",
  "photo_urls": [
    "https://cdn.example.com/reviews/1.jpg"
  ]
}
```

Validation rules:

- `overall_rating` required, 1..5
- Optional sub-ratings each 1..5
- Ratings must be in 0.5 increments
- `comment` required, 10..2000 chars
- `photo_urls` max 10 items

Business rules:

- Booking must exist
- Booking must be `completed`
- Review must be within 30 days of `booking.completed_at`
- Current user must be booking user or booking provider owner
- One review per `(booking_id, reviewer_user_id, review_type)`

Review type determination:

- Booking user writes a review about provider -> `review_type=provider`
- Provider writes a review about user -> `review_type=user`

Sub-rating behavior:

- For `review_type=provider`, sub-ratings are stored
- For `review_type=user`, sub-ratings are ignored and stored as null

Success response (`ReviewResponse`):

```json
{
  "review_id": 120,
  "review_type": "provider",
  "overall_rating": 4.5,
  "communication_rating": 5,
  "cleanliness_rating": 4,
  "accuracy_rating": 4.5,
  "location_rating": 4,
  "value_rating": 4.5,
  "comment": "Great experience and clear communication.",
  "photo_urls": ["https://cdn.example.com/reviews/1.jpg"],
  "reviewer": {
    "user_id": 7,
    "name": "Sara D.",
    "avatar_url": null,
    "member_since": "2024-03-01T10:00:00Z",
    "total_reviews_written": 5
  },
  "provider_response": null,
  "provider_response_at": null,
  "helpful_count": 0,
  "is_helpful_by_me": false,
  "status": "pending",
  "is_verified_booking": true,
  "created_at": "2026-02-23T10:00:00Z"
}
```

Common errors:

- `404 Booking not found`
- `400 Can only review completed bookings`
- `400 Review window has closed (30 days)`
- `403 Not part of this booking`
- `400 Already reviewed this booking`
- `422` validation errors

## 4.2 List Provider Reviews (Public)

Endpoint:

- `GET /reviews/provider/{provider_id}`

Auth:

- Optional bearer token

Query params:

- `sort_by`: `recent|rating_high|rating_low|helpful` (default `recent`)
- `skip`: default `0`, min `0`
- `limit`: default `20`, min `1`, max `100`

Behavior:

- If authenticated, `is_helpful_by_me` is personalized
- If unauthenticated, `is_helpful_by_me` is always false

Sort behavior:

- `recent`: `created_at desc`
- `rating_high`: `overall_rating desc`, then `created_at desc`
- `rating_low`: `overall_rating asc`, then `created_at desc`
- `helpful`: `helpful_count desc`, then `created_at desc`

Response:

- array of `ReviewResponse`

Implementation note:

- `reviewer.avatar_url` is currently always `null` in serializer.

## 4.3 Provider Review Stats

Endpoint:

- `GET /reviews/provider/{provider_id}/stats`

Response (`ReviewStatsResponse`):

```json
{
  "total_reviews": 31,
  "avg_rating": 4.72,
  "avg_communication_rating": 4.8,
  "avg_cleanliness_rating": 4.6,
  "avg_accuracy_rating": 4.7,
  "avg_location_rating": 4.5,
  "avg_value_rating": 4.6,
  "rating_distribution": {
    "5": 21,
    "4": 8,
    "3": 2,
    "2": 0,
    "1": 0
  }
}
```

Notes:

- `total_reviews` and averages come from provider aggregate columns.
- Distribution is computed from published visible reviews at request time.

Error:

- `404 Provider not found`

## 4.4 Helpful Toggle

Endpoint:

- `POST /reviews/{review_id}/helpful`

Auth:

- Required

Behavior:

- Toggles helpful vote for current user
- If not voted -> adds vote, increments `helpful_count`
- If already voted -> removes vote, decrements `helpful_count` (not below 0)

Responses:

```json
{
  "message": "Marked as helpful",
  "helpful_count": 11
}
```

```json
{
  "message": "Unmarked as helpful",
  "helpful_count": 10
}
```

Rules:

- Review must be published and visible
- Cannot mark own review helpful

Errors:

- `404 Review not found`
- `400 Cannot mark your own review as helpful`

## 4.5 Report Review

Endpoint:

- `POST /reviews/{review_id}/report`

Auth:

- Required

Request (`ReportReviewRequest`):

```json
{
  "reason": "spam",
  "details": "Contains promotional links"
}
```

Rules:

- One report per user per review

Response:

```json
{
  "message": "Review reported successfully"
}
```

Errors:

- `404 Review not found`
- `400 Already reported this review`

## 4.6 Provider Respond to Review

Endpoint:

- `POST /reviews/{review_id}/respond`

Auth:

- Required (provider owner)

Request (`ProviderResponseRequest`):

```json
{
  "response": "Thank you for your feedback. Happy to host again."
}
```

Rules:

- Only for provider reviews (`review_type=provider`)
- Review must be published and not hidden
- Only reviewed provider owner can respond
- Only one response allowed per review

Response:

```json
{
  "message": "Response added successfully"
}
```

Errors:

- `404 Review not found`
- `400 Can only respond to provider reviews`
- `400 Review not published yet`
- `400 Already responded to this review`
- `403 Not your review`

## 5) Admin Moderation Endpoints

Base prefix: `/admin/reviews`

## 5.1 List Reported Reviews

Endpoint:

- `GET /admin/reviews/reports`

Permission:

- `review:moderate`

Query params:

- `is_reviewed` default `false`
- `skip` default `0`, min `0`
- `limit` default `50`, min `1`, max `100`

Response:

- array of `AdminReviewReportItemResponse`

Each item includes:

- report info (`reason`, `details`, review state)
- reporter summary
- review summary
- moderation fields (`is_reviewed`, `reviewed_at`, `admin_notes`)

## 5.2 Review Report Action

Endpoint:

- `POST /admin/reviews/reports/{report_id}/review`

Permission:

- `review:moderate`

Request:

```json
{
  "action": "hide_review",
  "admin_notes": "Contains personal information and policy violation."
}
```

Allowed actions:

- `hide_review`
- `dismiss`
- `delete_review`

Rules:

- `admin_notes` required, 10..1000 chars

Behavior:

- Always marks report as reviewed and stores admin metadata
- `dismiss`: no review status change
- `hide_review`: review -> `status=hidden`, `is_hidden=true`
- `delete_review`: review -> `status=deleted`, `is_hidden=true`
- On hide/delete, rating aggregates are refreshed

Responses:

```json
{"message": "Report dismissed"}
```

```json
{"message": "Review hidden successfully"}
```

```json
{"message": "Review deleted successfully"}
```

## 5.3 Hide Review Directly

Endpoint:

- `POST /admin/reviews/{review_id}/hide`

Permission:

- `review:moderate`

Request:

```json
{
  "reason": "Policy violation: abusive content and personal info."
}
```

Rules:

- reason required, 10..1000 chars

Response:

```json
{"message": "Review hidden successfully"}
```

## 5.4 Unhide Review

Endpoint:

- `POST /admin/reviews/{review_id}/unhide`

Permission:

- `review:moderate`

Behavior:

- If review is deleted, cannot unhide
- Otherwise sets review back to `published`, clears hidden fields
- Sets `published_at` if missing
- Refreshes aggregates

Response:

```json
{"message": "Review unhidden successfully"}
```

Errors:

- `404 Review not found`
- `400 Deleted reviews cannot be unhidden`

## 6) Response Models (Frontend Mapping)

## 6.1 `ReviewResponse`

Fields:

- `review_id`
- `review_type`
- `overall_rating`
- optional sub-ratings
- `comment`
- `photo_urls`
- `reviewer` object
- `provider_response`, `provider_response_at`
- `helpful_count`, `is_helpful_by_me`
- `status`
- `is_verified_booking`
- `created_at`

## 6.2 `ReviewStatsResponse`

Fields:

- `total_reviews`
- `avg_rating`
- per-dimension averages
- `rating_distribution` map for 1..5

## 7) Frontend UX Rules

1. Show review composer only for completed bookings within 30-day window and if user/provider has not already reviewed booking.
2. Support 0.5 rating increments in UI controls.
3. For provider-review form, include category ratings; for user-review form, category ratings can be hidden.
4. Public review list should support sort options and pagination.
5. Helpful button should be toggle-style, based on `is_helpful_by_me`.
6. Show provider response block when present.
7. Show moderation-safe states by relying on public list endpoint (hidden/deleted are excluded).

## 8) Known Limitations / Notes

- There is no public endpoint to list reviews written *about users*.
- There is no endpoint to edit or delete own review after creation.
- `photo_urls` are plain URLs; this module does not upload files directly.
- Public list `is_helpful_by_me` requires valid bearer token; invalid token behaves as unauthenticated.

## 9) Error Contract

Typical payload:

```json
{
  "detail": "Error message"
}
```

Common statuses:

- `400` business rule/validation
- `403` permission/ownership
- `404` resource not found
- `422` schema validation
