
# API Documentation

Dokumentasi lengkap endpoint untuk Backend Task Management API.

**Base URL:**
- Local: `http://localhost:3000`
- Production: `http://13.217.194.136:3000`

**Authentication:**
Semua endpoint (kecuali Register, Login, Refresh) membutuhkan header:
`Authorization: Bearer <access_token>`

---

## 1. Authentication

### Register User
`POST /api/auth/register`

- **Body:**
  ```json
  {
    "name": "Nama User",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  
### Login User

`POST /api/auth/login`

  - **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response:** Mengembalikan `accessToken` (15 menit) dan `refreshToken` (7 hari).

### Refresh Token

`POST /api/auth/refresh`

  - **Body:**
    ```json
    {
      "refreshToken": "eyJhbGciOiJIUz..."
    }
    ```
  - **Response:** Mengembalikan `accessToken` baru.

### Get Current User Profile

`GET /api/auth/me`

  - **Headers:** `Authorization: Bearer <token>`

-----

## 2\. Projects

### Create Project

`POST /api/projects`

  - **Headers:** `Authorization: Bearer <token>`
  - **Body:**
    ```json
    {
      "title": "Nama Project",
      "description": "Deskripsi project (opsional)"
    }
    ```

### Get All Projects (List)

`GET /api/projects`

  - **Headers:** `Authorization: Bearer <token>`
  - **Query Parameters:**
      - `page`: Nomor halaman (Default: 1)
      - `limit`: Jumlah data per halaman (Default: 10)
      - `search`: Cari berdasarkan judul project (Opsional)
  - **Example:** `GET /api/projects?page=1&limit=5&search=backend`

### Update Project

`PUT /api/projects/:id`

  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** (Field yang dikirim bersifat opsional/partial)
    ```json
    {
      "title": "Update Judul",
      "description": "Update deskripsi"
    }
    ```

### Delete Project

`DELETE /api/projects/:id`

  - **Headers:** `Authorization: Bearer <token>`
  - **Note:** Hanya pemilik project yang bisa menghapus.

-----

## 3\. Tasks

### Create Task

`POST /api/tasks`

  - **Headers:** `Authorization: Bearer <token>`
  - **Body:**
    ```json
    {
      "title": "Judul Tugas",
      "description": "Deskripsi tugas",
      "status": "PENDING", // PENDING, IN_PROGRESS, DONE
      "dueDate": "2024-12-31T23:59:00Z", // ISO Date String
      "projectId": 1,
      "tagIds": [1, 2] // Array ID Tag (Opsional)
    }
    ```

### Get Tasks

`GET /api/tasks`

  - **Headers:** `Authorization: Bearer <token>`
  - **Query Parameters:**
      - `projectId`: Filter task berdasarkan ID Project tertentu.
  - **Example:** `GET /api/tasks?projectId=1`

-----

## 4\. Tags

### Create Tag

`POST /api/tags`

  - **Headers:** `Authorization: Bearer <token>`
  - **Body:**
    ```json
    {
      "name": "Urgent"
    }
    ```

### Get All Tags

`GET /api/tags`

  - **Headers:** `Authorization: Bearer <token>`

-----

## Common Error Responses

**400 Bad Request (Validation Error)**

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    }
  ]
}
```

**401 Unauthorized**

```json
{
  "success": false,
  "message": "Akses ditolak. Token tidak ditemukan."
}
```

**403 Forbidden**

```json
{
  "success": false,
  "message": "Akses ditolak. Anda bukan pemilik project ini."
}
```