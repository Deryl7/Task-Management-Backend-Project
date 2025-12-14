# Task Management API

Backend REST API untuk aplikasi manajemen tugas. Dibangun menggunakan Node.js, Express, dan Prisma ORM.

## 🚀 Fitur

- **Autentikasi JWT:** Register, Login, Refresh Token.
- **Project Management:** CRUD Project dengan validasi kepemilikan.
- **Task Management:** CRUD Task dengan status dan due date.
- **Tag System:** Many-to-Many relation antara Task dan Tag.
- **Security:** Helmet, CORS, Password Hashing (Bcrypt).
- **Pagination & Search:** Tersedia di endpoint list project.

## 🛠️ Tech Stack

- Node.js & Express
- Prisma ORM (SQLite for Dev)
- PostgreSQL (Production Ready)
- Zod (Validation)
- JWT (Authentication)

## 📦 Instalasi & Setup

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd backend-task-management
   ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Setup Environment**
    - Copy file `.env.example` menjadi `.env`
    - Isi variabel environment sesuai kebutuhan.

4. **Database Setup**
    ```bash
    # Generate Prisma Client & Migrate
    npx prisma migrate dev --name init

    # Seeding Data Awal
    npm run seed
    ```

5. **Jalankan Server**
   ```bash
    # Development
    npm run dev

    # Production (Start)
    npm start
    ```

## 🧪 Testing

Import file collection Postman yang tersedia di folder `docs/` (jika ada) atau gunakan endpoint berikut:

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

---

*Tugas Project Akhir Backend - Pemrograman Web*