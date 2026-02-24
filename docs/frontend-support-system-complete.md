# Frontend Integration Doc: Support System (Complete)

This document covers the standalone support ticket system (user <-> admin).

API areas:

- User endpoints: `/api/v1/support/...`
- Admin endpoints: `/api/v1/admin/support/tickets/...`

## 1) Scope

Included:

- Creating support tickets
- User and admin message flows
- Status transitions (user/admin)
- Assignment workflow
- Internal notes
- Attachment uploads for support

Excluded:

- Provider-user chat system (`/chat`), documented separately

## 2) Enums

### Support ticket status (`SupportTicketStatus`)

- `open`
- `in_progress`
- `answered`
- `closed`

### Support priority (`SupportTicketPriority`)

- `low`
- `normal`
- `high`
- `urgent`

## 3) Access and Permissions

### User side (`/support`)

- Authenticated user can only access own support tickets.

### Admin side (`/admin/support/tickets`)

Permissions by endpoint:

- List/get/messages: requires `user:read`
- Reply/assign/status update: requires `user:update`

## 4) Attachments for Support

Endpoint:

- `POST /support/attachments`

Request:

- multipart `file`

Rules:

- Allowed MIME prefixes: `image/`, `video/`, `audio/`
- Max size: 25MB
- Same attachment storage behavior as chat

Response (`SupportTicketAttachmentUploadResponse`):

```json
{
  "media_id": 3101,
  "url": "https://...",
  "thumb_url": "https://...",
  "mime_type": "image/png",
  "size_bytes": 230112,
  "width": 1024,
  "height": 768,
  "attachment_type": "image",
  "created_at": "2026-02-23T10:00:00Z"
}
```

Important:

- `media_id` ownership is validated against sender user on message creation.
- Admin replies with media must use media uploaded by that admin user account.

## 5) User Support Endpoints

## 5.1 Create Support Ticket

Endpoint:

- `POST /support/tickets`

Request (`CreateSupportTicketRequest`):

```json
{
  "subject": "Payment issue",
  "category": "billing",
  "priority": "normal",
  "text": "My wallet charge failed.",
  "media_id": null
}
```

Rules:

- `subject` required, 3..200 chars (trimmed subject cannot be empty)
- `category` optional, max 100
- `priority` default `normal`
- Must include at least one of `text` or `media_id`

Behavior:

- Creates ticket with status `open`
- Creates first non-internal message from user
- Updates ticket last-message fields
- Notifies active admins

Response (`SupportTicketDetailResponse`):

```json
{
  "ticket": {
    "ticket_id": 701,
    "subject": "Payment issue",
    "category": "billing",
    "status": "open",
    "priority": "normal",
    "user_id": 7,
    "assigned_admin_id": null,
    "last_message_at": "2026-02-23T10:00:00Z",
    "last_message_text": "My wallet charge failed.",
    "last_message_sender_is_admin": false,
    "created_at": "2026-02-23T10:00:00Z",
    "updated_at": "2026-02-23T10:00:00Z"
  },
  "user": {
    "user_id": 7,
    "name": "User Name",
    "avatar_url": null
  },
  "assigned_admin": null
}
```

## 5.2 List My Support Tickets

Endpoint:

- `GET /support/tickets`

Query params:

- `status_filter` optional (`open|in_progress|answered|closed`)
- `priority_filter` optional (`low|normal|high|urgent`)
- `skip` default `0`, min `0`
- `limit` default `50`, min `1`, max `100`

Response (`SupportTicketListResponse`):

```json
{
  "total": 12,
  "items": [
    {
      "ticket_id": 701,
      "subject": "Payment issue",
      "category": "billing",
      "status": "open",
      "priority": "normal",
      "user_id": 7,
      "assigned_admin_id": null,
      "last_message_at": "2026-02-23T10:00:00Z",
      "last_message_text": "My wallet charge failed.",
      "last_message_sender_is_admin": false,
      "created_at": "2026-02-23T10:00:00Z",
      "updated_at": "2026-02-23T10:00:00Z"
    }
  ]
}
```

## 5.3 Get My Support Ticket

Endpoint:

- `GET /support/tickets/{ticket_id}`

Rule:

- User can only access own ticket.

Response:

- `SupportTicketDetailResponse`

## 5.4 List My Ticket Messages

Endpoint:

- `GET /support/tickets/{ticket_id}/messages`

Query params:

- `before_id` optional
- `limit` default `100`, min `1`, max `200`

Behavior:

- User endpoint excludes internal notes (`is_internal_note=false` only).
- Sorted ascending in response.

Response (`SupportTicketMessageListResponse`):

```json
{
  "ticket_id": 701,
  "messages": [
    {
      "ticket_message_id": 1,
      "ticket_id": 701,
      "sender_user_id": 7,
      "sender_name": "User Name",
      "sender_is_admin": false,
      "is_internal_note": false,
      "text": "My wallet charge failed.",
      "media_id": null,
      "media_url": null,
      "media_thumb_url": null,
      "media_mime_type": null,
      "is_deleted": false,
      "created_at": "2026-02-23T10:00:00Z"
    }
  ],
  "has_more": false
}
```

## 5.5 Reply to My Ticket

Endpoint:

- `POST /support/tickets/{ticket_id}/messages`

Request (`CreateSupportTicketMessageRequest`):

```json
{
  "text": "Any update?",
  "media_id": null
}
```

Rules:

- Must include `text` or `media_id`.

Status behavior after user reply:

- If ticket was `closed`: changes to `open`, sets `reopened_at`, clears `closed_at`
- Otherwise: sets status to `in_progress`

Response:

- `SupportTicketMessageResponse`

## 5.6 User Update Ticket Status

Endpoint:

- `PATCH /support/tickets/{ticket_id}/status`

Request (`UpdateSupportTicketStatusRequest`):

```json
{
  "status": "closed"
}
```

User constraints:

- User can only set `open` or `closed`
- Any other status returns `400`

Behavior:

- `closed`: set `closed_at`
- `open`: set `reopened_at` and clear `closed_at`

Response (`SupportTicketStatusUpdateResponse`):

```json
{
  "ticket_id": 701,
  "status": "closed",
  "message": "Ticket status updated to closed"
}
```

## 6) Admin Support Endpoints

## 6.1 List Tickets (Admin)

Endpoint:

- `GET /admin/support/tickets`

Query params:

- `status_filter` optional
- `priority_filter` optional
- `assigned_admin_id` optional (>0)
- `assigned_to_me` boolean (default false)
- `user_id` optional (>0)
- `skip` default `0`
- `limit` default `50`, max `200`

Filter precedence note:

- If `assigned_to_me=true`, backend ignores `assigned_admin_id` filter.

Response:

- `SupportTicketListResponse`

## 6.2 Get Ticket (Admin)

Endpoint:

- `GET /admin/support/tickets/{ticket_id}`

Response:

- `SupportTicketDetailResponse`

## 6.3 List Messages (Admin)

Endpoint:

- `GET /admin/support/tickets/{ticket_id}/messages`

Behavior:

- Includes all messages, including internal notes.

Response:

- `SupportTicketMessageListResponse`

## 6.4 Admin Reply

Endpoint:

- `POST /admin/support/tickets/{ticket_id}/messages`

Request (`AdminReplySupportTicketRequest`):

```json
{
  "text": "Please send payment screenshot",
  "media_id": null,
  "is_internal_note": false
}
```

Rules:

- Must include `text` or `media_id`.
- `is_internal_note=true` is admin-only private note.

Behavior when `is_internal_note=false`:

- Updates last-message fields
- If status was `closed`: sets `in_progress`, sets `reopened_at`, clears `closed_at`
- Else: sets status `answered`
- Notifies end user

Behavior when `is_internal_note=true`:

- Creates message but does not change ticket status or last-message fields
- Not sent to user-facing message list endpoint

Auto-assignment behavior:

- If ticket has no assigned admin, replying admin is auto-assigned.

Response:

- `SupportTicketMessageResponse`

## 6.5 Assign Ticket

Endpoint:

- `PATCH /admin/support/tickets/{ticket_id}/assign`

Request (`AssignSupportTicketRequest`):

```json
{
  "admin_id": 3
}
```

Rules:

- `admin_id` optional; if omitted, assigns current admin.
- Target admin must exist and be active.

Behavior:

- If ticket status is `open`, assignment changes it to `in_progress`.
- If assignee changes, notified assigned admin user.

Response (`SupportTicketAssignResponse`):

```json
{
  "ticket_id": 701,
  "assigned_admin_id": 3,
  "message": "Support ticket assigned"
}
```

## 6.6 Admin Update Ticket Status

Endpoint:

- `PATCH /admin/support/tickets/{ticket_id}/status`

Request (`UpdateSupportTicketStatusRequest`):

```json
{
  "status": "closed"
}
```

Admin capabilities:

- Can set any `SupportTicketStatus` value.

Behavior:

- `closed`: set `closed_at`
- `open` or `in_progress`: set `reopened_at`, clear `closed_at`
- Notifies user about status update

Response:

- `SupportTicketStatusUpdateResponse`

## 7) Error Contract

Typical error payload:

```json
{
  "detail": "Error message"
}
```

Common status codes:

- `400` validation/business rules
- `403` ownership/permission restrictions
- `404` ticket/admin/media not found
- `422` schema validation

## 8) Frontend Implementation Notes

1. Use separate UI modules for `/support` and `/chat`; they are different systems.
2. Upload attachments first via `/support/attachments`, then send `media_id` in message payload.
3. User thread view should not expect internal notes; admin thread view should show them.
4. Reflect status transitions automatically after reply actions.
5. For admin inbox, support combined filters and `assigned_to_me` toggle.
6. Preserve message pagination using `before_id` cursor and `has_more`.
7. Distinguish sender role using `sender_is_admin` for bubble styling and labels.
8. There is no support-ticket message delete endpoint in current API.

## 9) Minimal Flows

### User flow

1. Create ticket (`POST /support/tickets`)
2. Poll/list tickets (`GET /support/tickets`)
3. Read thread (`GET /support/tickets/{id}/messages`)
4. Reply (`POST /support/tickets/{id}/messages`)
5. Close/reopen (`PATCH /support/tickets/{id}/status`)

### Admin flow

1. List inbox (`GET /admin/support/tickets`)
2. Assign ticket (`PATCH /admin/support/tickets/{id}/assign`)
3. Reply or internal note (`POST /admin/support/tickets/{id}/messages`)
4. Update status (`PATCH /admin/support/tickets/{id}/status`)
