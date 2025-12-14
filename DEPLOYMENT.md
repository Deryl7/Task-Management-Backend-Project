# Deployment Report

## 🌐 Production URL
- **Base URL:** http://13.217.194.136:3000
- **Health Check:** http://13.217.194.136:3000/
- **API Documentation:** Lihat file API-DOCS.md

## ☁️ AWS EC2 Details
- **Instance ID:** i-003eb7061a4c0d7e6
- **Instance Type:** t2.micro
- **OS:** Ubuntu Server 22.04 LTS
- **Public IP:** 13.217.194.136
- **Region:** us-east-1

## 🔑 Test Credentials
Gunakan akun ini untuk pengujian (Data dari Seeder):

| Role  | Email           | Password    |
|-------|-----------------|-------------|
| Admin | admin@test.com  | password123 |
| User  | deryl@test.com   | password123 |

## 🚀 Langkah Deployment (Ringkasan)

1. **Setup Server:**
   - Launch EC2 t2.micro (Ubuntu 22.04).
   - Konfigurasi Security Group: Open port 22 (SSH), 80 (HTTP), 3000 (App).
   - Install dependencies: Node.js v18, npm, git, pm2.

2. **Deploy Aplikasi:**
   - Clone repository dari GitHub.
   - Install dependencies (`npm install`).
   - Setup environment variables (`.env`).
   - Setup database (`prisma db push` & `npm run seed`).

3. **Process Management:**
   - Start aplikasi menggunakan PM2: `pm2 start src/app.js`.
   - Setup startup script agar aplikasi otomatis jalan saat reboot.

## 🛠️ Troubleshooting
Jika API tidak bisa diakses:
1. Pastikan instance state "Running" di AWS Console.
2. Cek status aplikasi: `pm2 status`.
3. Cek logs error: `pm2 logs`.