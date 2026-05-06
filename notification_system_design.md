# Campus Notification System Design

---

# Stage 1

## Objective

Design REST APIs and JSON contracts for a campus notification platform where students receive real-time notifications regarding:

- Placements
- Events
- Results

---

## Core Features

1. View notifications
2. Filter notifications by type
3. Mark notifications as read
4. Receive real-time notifications
5. Fetch unread notifications

---

## REST API Design

### 1. Get All Notifications

#### Endpoint

```http
GET /notifications
```

#### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| page | number | Pagination page number |
| limit | number | Number of records |
| type | string | Filter by notification type |

#### Response

```json
{
  "notifications": [
    {
      "id": "uuid",
      "studentId": 1042,
      "type": "Placement",
      "message": "TCS Hiring Drive",
      "isRead": false,
      "createdAt": "2026-04-22T17:49:42"
    }
  ]
}
```

---

### 2. Get Unread Notifications

#### Endpoint

```http
GET /notifications/unread
```

#### Response

```json
{
  "count": 5
}
```

---

### 3. Mark Notification as Read

#### Endpoint

```http
PATCH /notifications/:id/read
```

#### Response

```json
{
  "message": "Notification marked as read"
}
```

---

### 4. Create Notification

#### Endpoint

```http
POST /notifications
```

#### Request Body

```json
{
  "studentId": 1042,
  "type": "Placement",
  "message": "Amazon Hiring Drive"
}
```

#### Response

```json
{
  "message": "Notification created successfully"
}
```

---

## Notification Schema

```json
{
  "id": "uuid",
  "studentId": 1042,
  "type": "Placement",
  "message": "Amazon Hiring Drive",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

## Headers

```http
Content-Type: application/json
Authorization: Bearer token
```

---

## Real-Time Notification Mechanism

The system will use WebSockets (Socket.io) for real-time notification delivery.

Advantages:
- Instant updates
- Reduced polling
- Better user experience

---

## Naming Conventions

- REST-based endpoints
- Plural resource naming
- JSON response structure
- HTTP status codes for responses
