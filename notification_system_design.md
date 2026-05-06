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

---

# Stage 3

## Existing Query

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at ASC;
```

---

## Problems with the Query

The query may become slow as the notifications table grows to millions of rows.

### Reasons

1. `SELECT *` fetches unnecessary columns and increases data transfer.

2. Missing composite indexes may force full table scans.

3. Sorting using `ORDER BY created_at` becomes expensive on large datasets.

4. Fetching all unread notifications without pagination increases response size and memory usage.

---

## Optimized Approach

### 1. Fetch Only Required Columns

```sql
SELECT id, type, message, created_at
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC
LIMIT 20;
```

Advantages:
- Reduced network transfer
- Lower memory usage
- Faster query execution

---

## Recommended Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at DESC);
```

### Why Composite Index?

This index improves:
- Filtering by `student_id`
- Filtering unread notifications
- Sorting by `created_at`

without requiring additional sorting operations.

---

## Why Adding Indexes on Every Column is Not Effective

Adding indexes on every column is not recommended because:

1. Increased storage usage
2. Slower INSERT and UPDATE operations
3. Higher index maintenance overhead
4. Unused indexes waste resources

Indexes should only be created for frequently filtered or sorted columns.

---

## Query to Fetch Placement Notifications

```sql
SELECT id, student_id, type, message, created_at
FROM notifications
WHERE type = 'Placement'
ORDER BY created_at DESC;
```

---

## Additional Optimizations

### 1. Pagination

```sql
LIMIT 20 OFFSET 0;
```

Helps reduce database load and response size.

---

### 2. Caching

Frequently accessed unread notifications can be cached using Redis.

---

### 3. Partitioning

Notifications can be partitioned based on creation date for faster querying.

---

## Estimated Computational Cost

### Without Proper Index

- Time Complexity: O(n)
- Requires full table scan

### With Composite Index

- Time Complexity: O(log n)
- Faster filtering and sorting

---

## Final Optimized Query

```sql
SELECT id, type, message, created_at
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC
LIMIT 20;
```
---

# Stage 4

## Problem Statement

Currently, every time the frontend loads notifications, the backend directly queries the database.

As the number of users increases, this approach can create:

1. High database load
2. Increased response times
3. Slow user experience
4. Higher infrastructure cost
5. Reduced scalability

---

# Performance Improvement Strategies

## 1. Redis Caching

Frequently accessed notifications can be stored in Redis cache.

### Workflow

1. Frontend requests notifications
2. Backend checks Redis cache
3. If cache exists → return cached data
4. Otherwise:
   - fetch from PostgreSQL
   - store in Redis
   - return response

---

### Advantages

- Faster response time
- Reduced database queries
- Better scalability
- Lower DB server load

---

### Tradeoffs

- Cache invalidation complexity
- Additional memory usage
- Possible stale data

---

## 2. Pagination

Instead of fetching all notifications at once, fetch smaller batches.

### Example

```http
GET /notifications?page=1&limit=20
```

### Advantages

- Reduced response size
- Faster API responses
- Lower memory usage
- Better frontend rendering performance

---

## 3. Lazy Loading

Notifications are loaded only when required by the user.

### Example

Load more notifications while scrolling.

### Advantages

- Improved frontend performance
- Reduced unnecessary API calls

---

## 4. WebSockets for Real-Time Updates

Instead of repeatedly polling APIs, WebSockets can push notifications instantly.

### Technologies

- Socket.io
- WebSockets

### Advantages

- Real-time updates
- Reduced API polling
- Better user experience

---

## 5. Database Read Replicas

Read replicas can distribute read-heavy traffic across multiple DB servers.

### Advantages

- Reduced load on primary database
- Improved scalability
- Better availability

---

## 6. Connection Pooling

Database connection pooling reuses DB connections efficiently.

### Advantages

- Reduced connection overhead
- Faster query execution
- Better resource utilization

---

# Example Optimized Architecture

```text
Frontend
   ↓
Backend API Server
   ↓
Redis Cache
   ↓
PostgreSQL Database
```

For real-time updates:

```text
Backend
   ↓
Socket.io Server
   ↓
Connected Clients
```

---

# Additional Improvements

## Compression

API responses can be compressed using gzip.

---

## Rate Limiting

Prevent excessive API requests from clients.

---

## Monitoring

Use monitoring tools to track:
- API latency
- DB performance
- Error rates
- Cache hit ratio

---

# Final Scalable Flow

1. Client requests notifications
2. Backend checks Redis
3. Cached response returned if available
4. Otherwise fetch from DB
5. Store response in Redis
6. Send data to client
7. Real-time notifications pushed via WebSockets

---

# Conclusion

Using caching, pagination, lazy loading, WebSockets, and DB optimization significantly improves:

- Scalability
- Performance
- User experience
- Reliability
