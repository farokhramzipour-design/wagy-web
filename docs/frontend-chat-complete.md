# Frontend Integration Doc: Chat System (Complete)

This document covers the provider-user chat/ticket system under `/api/v1/chat`.

## 1) Scope

Included:

- Ticket creation between pet owner and provider
- Ticket list/detail
- Message list/send/delete
- Ticket status updates
- Attachment uploads
- Legacy conversation-compatible endpoints

Excluded:

- Support ticket system (user <-> admin), documented separately

## 2) Concepts

- Chat is modeled as `Conversation` but exposed as `ticket` in API.
- One ticket has two participants: owner (`user_id`) and sitter/provider user (`provider_user_id`).
- Ticket can be linked to a booking (`booking_id`) or standalone.

## 3) Enum Values

### Ticket status (`ConversationStatus`)

- `active`
- `archived`
- `blocked`

### Message type (`MessageType`)

- `text`
- `image`
- `file`
- `system`

## 4) Roles and Access Rules

- Owner can access their tickets.
- Provider can access tickets where they are `provider_user_id` and user is provider.
- Active admin can access any ticket.

## 5) Attachments

Endpoint:

- `POST /chat/attachments`

Request:

- Multipart `file`

Rules:

- Allowed MIME prefixes: `image/`, `video/`, `audio/`
- Max upload size: 25MB
- On invalid type: `400 Attachment must be image, video, or audio`
- On oversize: `400 Attachment too large (max 25MB)`

Response (`ChatAttachmentUploadResponse`):

```json
{
  "media_id": 1201,
  "url": "https://...",
  "thumb_url": "https://...",
  "mime_type": "image/jpeg",
  "size_bytes": 532112,
  "width": 1200,
  "height": 800,
  "attachment_type": "image",
  "created_at": "2026-02-23T10:00:00Z"
}
```

Notes:

- `thumb_url` is generated for image uploads.
- `attachment_type` is derived from MIME (`image|video|audio|file`).

## 6) Create Ticket

Endpoint:

- `POST /chat/tickets`

Request (`CreateTicketRequest`):

```json
{
  "provider_id": 33,
  "subject": "Pickup details",
  "booking_id": 501,
  "text": "Hi, can we adjust pickup time?",
  "media_id": null
}
```

Rules:

- Must include at least one of `text` or `media_id`.
- Provider must exist and be approved.
- Cannot create ticket with yourself.
- If `booking_id` is provided:
- booking must exist
- booking must belong to current user
- booking provider must match `provider_id`
- duplicate ticket for same `(booking_id, owner, provider)` is rejected
- Subject is optional; if omitted and booking ticket, backend sets `Booking #{booking_id}`.

Success response (`TicketResponse`):

```json
{
  "ticket_id": 9001,
  "booking_id": 501,
  "subject": "Booking #501",
  "owner": {
    "user_id": 7,
    "name": "Owner Name",
    "avatar_url": null
  },
  "sitter": {
    "user_id": 22,
    "name": "Provider Name",
    "avatar_url": null
  },
  "last_message": {
    "text": "Hi, can we adjust pickup time?",
    "type": "text",
    "at": "2026-02-23T10:00:00Z"
  },
  "unread_count": 0,
  "status": "active",
  "created_at": "2026-02-23T10:00:00Z",
  "updated_at": "2026-02-23T10:00:00Z"
}
```

## 7) List Tickets

Endpoint:

- `GET /chat/tickets`

Query params:

- `scope`: `auto|owner|provider|all` (default `auto`)
- `status_filter`: optional `active|archived|blocked`
- `skip`: default `0`, min `0`
- `limit`: default `50`, min `1`, max `100`

Scope behavior:

- `auto`: provider users get `provider`, others get `owner`
- `owner`: tickets where current user is owner
- `provider`: tickets where current user is provider (requires provider account)
- `all`: for provider users, union of owner+provider tickets; for non-provider users, owner tickets

Response (`TicketListResponse`):

```json
{
  "total": 25,
  "items": [
    {
      "ticket_id": 9001,
      "booking_id": 501,
      "subject": "Booking #501",
      "owner": {"user_id": 7, "name": "Owner Name", "avatar_url": null},
      "sitter": {"user_id": 22, "name": "Provider Name", "avatar_url": null},
      "last_message": {"text": "Hi", "type": "text", "at": "2026-02-23T10:00:00Z"},
      "unread_count": 2,
      "status": "active",
      "created_at": "2026-02-22T09:00:00Z",
      "updated_at": "2026-02-23T10:00:00Z"
    }
  ]
}
```

Implementation note:

- `total` currently equals the returned page length (post-pagination) in this endpoint, not full count.

### Provider dashboard shortcut

Endpoint:

- `GET /chat/dashboard/tickets`

Same as listing provider scope; requires provider account.

## 8) Get Ticket Detail

Endpoint:

- `GET /chat/tickets/{ticket_id}`

Response:

- `TicketResponse`

Errors:

- `404 Ticket not found`
- `403 Not authorized for this ticket`

## 9) Message APIs

## 9.1 List Ticket Messages

Endpoint:

- `GET /chat/tickets/{ticket_id}/messages`

Query params:

- `before_id` optional (load messages where id `< before_id`)
- `limit` default `50`, min `1`, max `100`

Behavior:

- Sorted ascending in response.
- If response has at least one message:
- participant `unread_count` is reset to `0`
- `last_read_at` and `last_read_message_id` updated

Response (`TicketMessageListResponse`):

```json
{
  "ticket_id": 9001,
  "messages": [
    {
      "message_id": 1,
      "ticket_id": 9001,
      "sender_id": 7,
      "sender_name": "Owner Name",
      "sender_avatar": null,
      "message_type": "text",
      "attachment_type": null,
      "media_mime_type": null,
      "text": "Hello",
      "media_url": null,
      "media_thumbnail_url": null,
      "is_deleted": false,
      "created_at": "2026-02-23T10:00:00Z"
    }
  ],
  "has_more": true
}
```

## 9.2 Send Message

Endpoint:

- `POST /chat/tickets/{ticket_id}/messages`

Request (`SendTicketMessageRequest`):

```json
{
  "text": "Can you share photos?",
  "media_id": null
}
```

Rules:

- Must include `text` or `media_id`.
- Cannot send if ticket is `blocked` (`403`) or `archived` (`400`).
- `media_id` must belong to sender user.
- Media message type mapping: image media -> `message_type=image`; video/audio media -> `message_type=file`.

Behavior:

- Increments unread count for the other participant.
- Updates ticket last-message metadata.

Response:

- `TicketMessageResponse`

## 9.3 Delete Message (Soft Delete)

Endpoint:

- `DELETE /chat/tickets/{ticket_id}/messages/{message_id}`

Rules:

- Only sender can delete own message.
- Marks message as deleted (`is_deleted=true`), does not hard-delete row.

Response:

```json
{
  "message": "Message deleted"
}
```

Error:

- `404 Message not found or not yours`

## 10) Ticket Status Update

Endpoint:

- `PATCH /chat/tickets/{ticket_id}/status`

Request (`UpdateTicketStatusRequest`):

```json
{
  "status": "archived"
}
```

Allowed request statuses:

- `active`
- `archived`

Response (`TicketStatusResponse`):

```json
{
  "ticket_id": 9001,
  "status": "archived",
  "message": "Ticket marked as archived"
}
```

Notes:

- If ticket is currently `blocked`, non-admin users cannot change status (`403`).
- API supports filtering/listing blocked tickets, but this status is not settable by this payload schema.

## 11) Legacy Conversation Endpoints

These remain available for backward compatibility:

- `GET /chat/conversations`
- `GET /chat/conversations/{conversation_id}/messages`
- `POST /chat/conversations/{conversation_id}/messages`
- `DELETE /chat/conversations/{conversation_id}/messages/{message_id}`

Differences from ticket endpoints:

- Uses `conversation_id` in payload keys.
- Message `created_at` is returned as ISO string in legacy serializers.
- Use ticket endpoints for new frontend work.

## 12) Error Contract

Typical error payload:

```json
{
  "detail": "Error message"
}
```

Common statuses:

- `400` validation/business rule
- `403` authorization/business restriction
- `404` resource not found
- `422` schema validation

## 13) Frontend Implementation Checklist

1. Upload attachment first (`/chat/attachments`), then send message with `media_id`.
2. Use `/chat/tickets` for list screens; do not depend on legacy `/conversations` for new UI.
3. On opening a thread, call message list endpoint to clear unread count server-side.
4. Use `before_id` pagination for infinite-scroll upward loading.
5. Disable composer when ticket status is `archived` or `blocked`.
6. Support soft-deleted message rendering (`text=null`, `is_deleted=true`).
7. Handle provider/non-provider scope behavior (`auto` vs explicit scope).
8. No WebSocket endpoint exists in this module; use polling or manual refresh for realtime UX.
