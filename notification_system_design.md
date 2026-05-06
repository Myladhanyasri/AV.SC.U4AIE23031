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


---

# Stage 2

## Database Choice

The recommended database for the notification system is PostgreSQL.

### Reasons for Choosing PostgreSQL

1. Strong support for relational data
2. Efficient indexing and querying
3. ACID compliance for reliable transactions
4. Supports pagination, filtering, and sorting efficiently
5. Scalable for large datasets
6. Good support for concurrent users

---

## Database Schema

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Explanation of Fields

| Column | Description |
|---|---|
| id | Unique notification ID |
| student_id | Student receiving notification |
| type | Notification type (Placement/Event/Result) |
| message | Notification content |
| is_read | Read status |
| created_at | Notification creation timestamp |

---

## Supported Notification Types

- Placement
- Event
- Result

---

## Recommended Indexes

```sql
CREATE INDEX idx_student_id
ON notifications(student_id);

CREATE INDEX idx_is_read
ON notifications(is_read);

CREATE INDEX idx_created_at
ON notifications(created_at);
```

---

## Sample SQL Queries

### Fetch Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
ORDER BY created_at DESC
LIMIT 20;
```

---

### Fetch Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false;
```

---

### Mark Notification as Read

```sql
UPDATE notifications
SET is_read = true
WHERE id = 'notification-id';
```

---

## Problems as Data Volume Increases

As the number of notifications grows to millions of records, the following issues may occur:

1. Slow query performance
2. Increased database load
3. Large table scans
4. Delayed API responses
5. Higher memory consumption

---

## Solutions for Scalability

### 1. Database Indexing

Indexes improve filtering and sorting performance.

### 2. Pagination

Fetching limited records reduces response size and DB load.

### 3. Caching

Redis can be used to cache frequently accessed notifications.

### 4. Table Partitioning

Partitioning notifications by date improves query performance.

### 5. Read Replicas

Read replicas help distribute database read traffic.

---

## API and DB Relationship

The REST APIs designed in Stage 1 interact with the database as follows:

| API | DB Operation |
|---|---|
| GET /notifications | SELECT |
| POST /notifications | INSERT |
| PATCH /notifications/:id/read | UPDATE |
| GET /notifications/unread | SELECT |
