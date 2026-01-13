# Hospital API

REST API สำหรับระบบโรงพยาบาล พัฒนาด้วย Node.js, Fastify และ PostgreSQL

## 🚀 เริ่มต้นใช้งาน

### ติดตั้ง Dependencies

```bash
npm install
```

### ตั้งค่า Environment Variables

สร้างไฟล์ `.env` และตั้งค่าดังนี้:

```
PORT=3000
HOST=0.0.0.0
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### สร้าง Database

```bash
# เข้า PostgreSQL แล้วรัน
CREATE DATABASE hospital_db;

# รัน migration
psql -U postgres -d hospital_db -f src/db/migrations/001_create_patients.sql
```

### รันเซิร์ฟเวอร์

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Health Check

- `GET /` - ตรวจสอบสถานะ API
- `GET /health` - ตรวจสอบสถานะ API และ Database

### Patients

- `GET /patients` - ดึงรายชื่อผู้ป่วยทั้งหมด
- `GET /patients/:id` - ดึงข้อมูลผู้ป่วยตาม ID
- `POST /patients` - สร้างผู้ป่วยใหม่
- `PUT /patients/:id` - แก้ไขข้อมูลผู้ป่วย
- `DELETE /patients/:id` - ลบผู้ป่วย

### ตัวอย่าง Request Body สำหรับสร้างผู้ป่วย

```json
{
  "first_name": "สมชาย",
  "last_name": "ใจดี",
  "date_of_birth": "1990-05-15",
  "phone": "081-234-5678",
  "email": "somchai@example.com"
}
```

## 📁 โครงสร้างโปรเจค

```
hospital-api/
├── src/
│   ├── app.js              # Fastify app configuration
│   ├── server.js           # Entry point
│   ├── plugins/
│   │   └── database.js     # PostgreSQL connection
│   ├── routes/
│   │   ├── root.js         # Root & health routes
│   │   └── patients/
│   │       └── index.js    # Patient CRUD routes
│   └── db/
│       └── migrations/     # SQL migrations
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠 Technologies

- **Node.js** - Runtime
- **Fastify** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client for Node.js
