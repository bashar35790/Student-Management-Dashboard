# Student Management API

Base URL: `http://localhost:5000/api/v1`

All responses use the consistent shape:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

List endpoints include a `meta` object:

```json
{
  "meta": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
}
```

## Endpoints

| Method | Path                | Description                                  |
|--------|---------------------|----------------------------------------------|
| GET    | `/health`           | Health check                                 |
| GET    | `/students`         | List students (search, filter, paginate, sort) |
| GET    | `/students/:id`     | Get a single student                         |
| POST   | `/students`         | Create a student                             |
| PATCH  | `/students/:id`     | Update a student (partial allowed)           |
| DELETE | `/students/:id`     | Delete a student                             |

## GET /students query params

| Param     | Values                              | Default |
|-----------|-------------------------------------|---------|
| `search`  | matches student name or email       | —       |
| `status`  | `ACTIVE` / `INACTIVE`               | —       |
| `class`   | exact class name (case-insensitive) | —       |
| `page`    | positive integer                    | `1`     |
| `limit`   | positive integer, max `100`         | `10`    |
| `sortBy`  | `name` / `createdAt` / `class`      | `createdAt` |
| `sortOrder` | `asc` / `desc`                    | `asc`   |

## HTTP status codes

| Code | Meaning                                     |
|------|---------------------------------------------|
| 200  | Successful request                          |
| 201  | Successfully created                        |
| 400  | Invalid request (validation)                |
| 404  | Resource not found                          |
| 409  | Conflict (duplicate email)                  |
| 500  | Server error                                |

## Example payloads

**POST /students**

```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1 555-0101",
  "class": "Grade 9A",
  "status": "ACTIVE"
}
```

All fields are required. Validation errors return `400` with field details:

```json
{
  "success": false,
  "message": "Invalid request data",
  "details": { "email": ["Please enter a valid email address"] }
}
```