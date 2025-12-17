# Deployment Report

## 🌐 Production URL
- **Base URL:** http://54.226.237.227:3000
- **Health Check:** http://54.226.237.227:3000/
- **API Documentation:** Lihat file API-DOCS.md pada repository.

## ☁️ AWS EC2 Details
- **Instance ID:** i-003eb7061a4c0d7e6
- **Instance Type:** t2.micro
- **OS:** Ubuntu Server 22.04 LTS
- **Public IP:** 54.226.237.227
- **Region:** us-east-1 (AWS Academy Standard)

## 🔑 Test Credentials
Akun ini telah disiapkan melalui database seeder untuk keperluan pengujian:

| Role  | Email           | Password    |
|-------|-----------------|-------------|
| Admin | admin@test.com  | password123 |
| User  | deryl@test.com   | password123 |
| User  | agam@test.com   | password123 |

## 🚀 Langkah Deployment

Berikut adalah ringkasan langkah-langkah yang dilakukan untuk men-deploy aplikasi ke AWS EC2:

1. **Setup Server (AWS EC2)**
   - Membuat instance EC2 t2.micro dengan OS Ubuntu 22.04 LTS.
   - Mengkonfigurasi Security Group untuk membuka port:
     - 22 (SSH)
     - 80 (HTTP)
     - 3000 (Aplikasi Node.js)
   - Masuk ke server via SSH dan melakukan update sistem (`apt update`).

2. **Instalasi Environment**
   - Install Node.js v18 LTS.
   - Install Git, npm, dan PM2 (Process Manager).
   - Perintah: `sudo npm install -g pm2`.

3. **Deploy Aplikasi**
   - Clone repository dari GitHub.
   - Install dependencies menggunakan `npm install`.
   - Membuat file `.env` production secara manual (berisi SECRET keys dan DATABASE_URL lokal).
   - Setup database production (SQLite) menggunakan Prisma:
     - `npx prisma generate`
     - `npx prisma db push`
     - `npm run seed` (Mengisi data awal).

4. **Running Application**
   - Menjalankan aplikasi menggunakan PM2 agar berjalan di background.
   - Perintah: `pm2 start src/app.js --name "backend-task"`.
   - Mengatur startup script agar aplikasi otomatis jalan saat server restart (`pm2 startup` & `pm2 save`).

## 🛠️ Verifikasi & Troubleshooting

Cara memastikan aplikasi berjalan dengan baik:

1. **Cek Status Process**
   Jalankan perintah `pm2 status` di terminal server. Pastikan status app bernilai `online`.

2. **Cek Logs**
   Jika terjadi error, jalankan `pm2 logs` untuk melihat log error secara realtime.

3. **Cek Koneksi**
   Akses Public IP dengan port 3000 via browser. Jika loading terus menerus, pastikan Security Group AWS sudah mengizinkan Inbound Rule Custom TCP Port 3000 dari 0.0.0.0/0.