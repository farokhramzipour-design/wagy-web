# Frontend Integration Doc: Search and Discovery (Complete)

This document defines the complete frontend contract for search and discovery.

Base API prefix: `/api/v1`

## 1) Scope

Included:

- Service-type discovery for search landing
- Dynamic filter discovery per service type
- Provider search endpoint (with dynamic filters, geo, price, rating, availability)
- Provider service details endpoint for search result click-through
- Sorting, pagination, and edge-case behavior

Excluded:

- Booking flow after service selection
- Admin service-builder setup details (except filter metadata implications)

## 2) Public Endpoints Overview

All endpoints in this section are public (no auth required).

1. `GET /search/discovery/service-types`
2. `GET /search/filters/{service_type_id}`
3. `POST /search/providers`
4. `GET /search/providers/{provider_service_id}`

## 2.1 Filter and Sort Enums Used by Search

`filter_type` values exposed in discovery metadata:

- `exact`
- `range`
- `in_list`
- `contains`
- `gte`
- `lte`

`sort_by` values accepted by search request:

- `distance`
- `price`
- `rating`
- `response_time`

## 3) Discovery Service Types

Endpoint:

- `GET /search/discovery/service-types`

Purpose:

- Returns active service types, each with its currently available dynamic search filters.

Response (`SearchDiscoveryServiceTypesResponse`):

```json
{
  "items": [
    {
      "service_type_id": 3,
      "name_en": "Boarding",
      "name_fa": "پت بردینگ",
      "filters": [
        {
          "field_id": 101,
          "field_key": "has_yard",
          "label_en": "Has yard",
          "label_fa": "حیاط دارد",
          "filter_type": "exact",
          "field_type": "switch",
          "is_searchable": false,
          "filter_priority": 10,
          "options": [true, false],
          "min": null,
          "max": null
        }
      ]
    }
  ]
}
```

Behavior:

- Only active service types are returned.
- Service types are ordered by `display_order asc`, then `service_type_id asc`.
- Per service type, filters are ordered by `filter_priority desc`, then `display_order asc`.

## 4) Get Available Filters for a Service Type

Endpoint:

- `GET /search/filters/{service_type_id}`

Purpose:

- Returns filter metadata frontend should use to build dynamic filter UI.

Response (`SearchAvailableFiltersResponse`):

```json
{
  "service_type_id": 3,
  "filters": [
    {
      "field_id": 101,
      "field_key": "pet_size",
      "label_en": "Pet Size",
      "label_fa": "اندازه حیوان",
      "filter_type": "in_list",
      "field_type": "multiselect",
      "is_searchable": true,
      "filter_priority": 20,
      "options": [
        {"value": "small", "label_en": "Small", "label_fa": "کوچک"},
        {"value": "large", "label_en": "Large", "label_fa": "بزرگ"}
      ],
      "min": null,
      "max": null
    },
    {
      "field_id": 102,
      "field_key": "max_dogs_at_once",
      "label_en": "Max dogs",
      "label_fa": "حداکثر سگ",
      "filter_type": "range",
      "field_type": "number",
      "is_searchable": false,
      "filter_priority": 15,
      "options": null,
      "min": 1,
      "max": 10
    }
  ]
}
```

Filter metadata rules:

- Select-like fields (`select`, `radio`, `checkbox`, `multiselect`) include `options`.
- Numeric fields (`number`, `currency`, `slider`) include `min` and `max` when configured.
- `switch` fields include `options: [true, false]`.

Important behavior:

- Backend does not validate whether `service_type_id` exists here; unknown IDs typically return an empty `filters` list.

## 5) Provider Search

Endpoint:

- `POST /search/providers`

Request schema (`SearchProvidersRequest`):

```json
{
  "service_type_id": 3,
  "latitude": 35.7219,
  "longitude": 51.3347,
  "radius_km": 10,
  "filters": {
    "pet_size": ["small", "medium"],
    "has_yard": true,
    "max_dogs_at_once": {"gte": 1, "lte": 4},
    "bio": "calm"
  },
  "min_price": 500000,
  "max_price": 2000000,
  "min_rating": 4,
  "verified_only": false,
  "booking_date": "2026-03-10",
  "start_time": "10:00:00",
  "check_in_date": null,
  "check_out_date": null,
  "number_of_pets": 1,
  "sort_by": "distance",
  "skip": 0,
  "limit": 20
}
```

Request field constraints:

- `service_type_id`: required, `>0`
- `radius_km`: default `10`, range `1..100`
- `min_price`/`max_price`: optional, `>=0`
- `min_rating`: optional, `0..5`
- `number_of_pets`: default `1`, range `1..10`
- `sort_by`: `distance|price|rating|response_time` (default `distance`)
- `skip`: default `0`, `>=0`
- `limit`: default `20`, range `1..100`

Core inclusion criteria before dynamic filtering:

- Service belongs to requested `service_type_id`
- Provider service `is_active=true`
- Provider service `is_complete=true`
- At least one provider step_data row is complete
- Provider is active (`provider.is_active=true`)

Additional filters:

- `verified_only=true` keeps only `provider.verified=true`
- `min_rating` filters by provider average rating
- Geo filter applies only when both `latitude` and `longitude` are provided
- Price filter uses extracted price from service data
- Optional availability check when `booking_date` or `check_in_date` is provided

### Dynamic `filters` payload grammar

Use keys from `/search/filters/{service_type_id}` `field_key` values.

`exact` type examples:

```json
{"has_yard": true}
```

```json
{"pet_gender": "male"}
```

`in_list` type examples:

```json
{"pet_size": ["small", "medium"]}
```

```json
{"pet_size": "small"}
```

`range` / `gte` / `lte` supported examples:

```json
{"max_dogs_at_once": {"gte": 1, "lte": 4}}
```

```json
{"max_dogs_at_once": {"gte": 2}}
```

```json
{"max_dogs_at_once": 3}
```

`contains` type example:

```json
{"bio": "calm"}
```

Dynamic filter behavior notes:

- Unknown filter keys are ignored (not an error).
- If an allowed filter key is applied but provider data misses that key, provider is excluded.
- Boolean `exact` accepts real booleans and string aliases (`true/1/yes`, `false/0/no`).

### Price filtering behavior

Price extraction precedence from provider service data:

1. `price_per_night`
2. `price_per_hour`
3. `base_price`
4. `price`

If `min_price` or `max_price` is sent and no price field can be extracted, provider is excluded.

### Availability behavior inside search

Availability check runs when `booking_date` or `check_in_date` is provided.

Search passes through these fields to availability checker:

- `booking_date` or fallback `check_in_date`
- `start_time`
- `check_in_date`
- `check_out_date`
- `number_of_pets`

Important:

- Providers failing availability are silently excluded (no per-provider reason in response).
- If only `check_out_date` is provided without `booking_date` and `check_in_date`, availability check is not triggered by search engine.

### Sorting behavior

- `distance`: ascending by `distance_km`, null distance values last
- `price`: ascending by extracted price, null price values last
- `rating`: descending by provider average rating
- `response_time`: ascending by `typical_response_time_hours`, null values last

Distance notes:

- Distance is calculated with Haversine formula.
- If request lacks coordinates, `distance_km` in results is `null`.
- If `sort_by=distance` without coordinates, all rows have null distance, so ordering should be treated as non-deterministic.

Response (`SearchProvidersResponse`):

```json
{
  "total": 57,
  "count": 20,
  "results": [
    {
      "provider_id": 25,
      "business_name": "Happy Paws",
      "provider_service_id": 123,
      "service_type_id": 3,
      "service_type": {
        "service_type_id": 3,
        "name_en": "Boarding",
        "name_fa": "پت بردینگ",
        "icon_media_id": 91,
        "icon_url": "https://...",
        "icon_thumb_url": "https://..."
      },
      "average_rating": 4.8,
      "total_reviews": 42,
      "verified": true,
      "distance_km": 2.73,
      "response_time_hours": 1,
      "service_data": {
        "price": 1500000,
        "has_yard": true,
        "accepts_puppies": true,
        "max_dogs_at_once": 4,
        "available_days": ["monday", "tuesday"],
        "instant_book": false,
        "response_time": "within_1_hour"
      }
    }
  ],
  "applied_filters": {
    "pet_size": ["small", "medium"],
    "has_yard": true
  },
  "available_filters": {
    "service_type_id": 3,
    "filters": []
  },
  "pagination": {
    "skip": 0,
    "limit": 20
  }
}
```

Response semantics:

- `total`: filtered total before pagination
- `count`: number of items in current page
- `service_data` in results is a highlight subset, not full service form data
- `applied_filters` echoes request `filters` payload
- `available_filters` always included for frontend UI sync

## 6) Provider Service Detail for Search Result

Endpoint:

- `GET /search/providers/{provider_service_id}`

Purpose:

- Full details for selected result card.

Response (`SearchProviderDetailResponse`):

```json
{
  "provider_service_id": 123,
  "provider": {
    "provider_id": 25,
    "business_name": "Happy Paws",
    "verified": true,
    "average_rating": 4.8,
    "total_reviews": 42,
    "city": "Tehran",
    "latitude": 35.72,
    "longitude": 51.33
  },
  "service_type": {
    "service_type_id": 3,
    "name_en": "Boarding",
    "name_fa": "پت بردینگ",
    "icon_media_id": 91,
    "icon_url": "https://...",
    "icon_thumb_url": "https://..."
  },
  "service_data": {
    "price_per_night": 1500000,
    "has_yard": true,
    "max_dogs_at_once": 4,
    "available_days": ["monday", "tuesday"]
  },
  "status": "active",
  "is_active": true
}
```

Error:

- `404 Service not found`

Detail inclusion criteria are same active/complete constraints as search.

## 7) Frontend Filter UI Strategy

1. Fetch service types and filter definitions from discovery endpoint on search home.
2. On service type change, fetch `/search/filters/{service_type_id}` to ensure latest schema.
3. Build filter controls by `field_type` + `filter_type`:
- select/radio/checkbox/multiselect from `options`
- number/currency/slider range inputs from `min`/`max`
- switch as boolean toggle
- text/textarea as contains text input
4. Send only active user-selected filters in `filters` object.
5. Preserve `skip/limit` and sort state in URL/query state for shareable search.

## 8) Practical Caveats

- `is_searchable` metadata is returned but currently not used by backend search logic.
- Unknown `filters` keys are ignored and still echoed in `applied_filters`.
- If coordinates are provided, providers without coordinates are excluded.
- Search result `service_data` is intentionally condensed highlights. Use detail endpoint for full data.
- Discovery/filter endpoints may return empty filter arrays for service types without configured filterable fields.
- `min_price` and `max_price` are decimal fields; frontend can send numeric JSON values, but string-safe decimal formatting is recommended for precision-sensitive clients.

## 9) Admin-Managed Filter Configuration (Optional Frontend Admin)

If you have admin frontend for search config:

- `PUT /admin/filters/fields/{field_id}/config`
- `GET /admin/filters/service-types/{service_type_id}/filterable-fields`

`PUT` request body:

```json
{
  "is_filterable": true,
  "filter_type": "range",
  "filter_priority": 10,
  "is_searchable": false
}
```

This configuration drives discovery/search filter metadata seen by public frontend.

## 10) Error Contract

Typical error payload:

```json
{
  "detail": "Error message"
}
```

Common statuses:

- `400` invalid request values or query constraints
- `404` provider service not found (detail endpoint)
- `422` request schema validation (search request, sort values, ranges)
