# S3 Upload Service

## Setup

1. ติดตั้ง dependencies:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @fastify/multipart
```

2. เพิ่ม environment variables ใน `.env`:

```env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=your_bucket_name
```

## API Endpoints

### 1. Upload File (Server-side)

อัปโหลดไฟล์ผ่านเซิร์ฟเวอร์

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

**Request:**

```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/to/image.jpg"
```

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "key": "images/1234567890_abc123_image.jpg",
    "bucket": "your-bucket-name",
    "location": "https://your-bucket-name.s3.ap-southeast-1.amazonaws.com/images/1234567890_abc123_image.jpg"
  }
}
```

### 2. Get Signed Download URL

สร้าง URL สำหรับดาวน์โหลดไฟล์ที่มีระยะเวลาจำกัด (สำหรับไฟล์ private)

**Endpoint:** `GET /signed-url?key=<file_key>&expiresIn=<seconds>`

**Request:**

```bash
curl "http://localhost:3000/signed-url?key=images/1234567890_abc123_image.jpg&expiresIn=3600"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://your-bucket-name.s3.ap-southeast-1.amazonaws.com/...",
    "expiresIn": 3600
  }
}
```

### 3. Delete File

ลบไฟล์จาก S3

**Endpoint:** `DELETE /delete`

**Request:**

```bash
curl -X DELETE http://localhost:3000/delete \
  -H "Content-Type: application/json" \
  -d '{"key": "images/1234567890_abc123_image.jpg"}'
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 4. Get Presigned Upload URL (Client-side)

สร้าง URL สำหรับให้ client อัปโหลดไฟล์โดยตรง (ไม่ผ่านเซิร์ฟเวอร์)

**Endpoint:** `POST /presigned-upload-url`

**Request:**

```bash
curl -X POST http://localhost:3000/presigned-upload-url \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "image.jpg",
    "contentType": "image/jpeg",
    "expiresIn": 3600
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://your-bucket-name.s3.ap-southeast-1.amazonaws.com/...",
    "key": "images/1234567890_abc123_image.jpg",
    "expiresIn": 3600
  }
}
```

จากนั้นใช้ URL นี้อัปโหลดด้วย PUT request:

```bash
curl -X PUT "https://your-bucket-name.s3.ap-southeast-1.amazonaws.com/..." \
  -H "Content-Type: image/jpeg" \
  --data-binary "@/path/to/image.jpg"
```

## Features

- ✅ รองรับไฟล์ประเภท: JPEG, PNG, GIF, WebP, PDF
- ✅ จำกัดขนาดไฟล์สูงสุด 5MB
- ✅ สร้าง unique key อัตโนมัติ
- ✅ รองรับการอัปโหลดทั้ง server-side และ client-side
- ✅ สร้าง signed URL สำหรับเข้าถึงไฟล์ private
- ✅ ลบไฟล์ได้

## S3 Service Methods

```typescript
import { S3Service } from "./services/s3.service";

const s3Service = new S3Service();

// Upload file
const result = await s3Service.uploadFile({
  key: "folder/filename.jpg",
  body: buffer,
  contentType: "image/jpeg",
  acl: "public-read", // หรือ 'private'
});

// Delete file
await s3Service.deleteFile("folder/filename.jpg");

// Get signed download URL
const url = await s3Service.getSignedDownloadUrl("folder/filename.jpg", 3600);

// Get signed upload URL
const uploadUrl = await s3Service.getSignedUploadUrl(
  "folder/filename.jpg",
  "image/jpeg",
  3600
);

// Generate unique key
const key = s3Service.generateUniqueKey("images", "photo.jpg", "user123");
// Result: images/user123_1234567890_abc123_photo.jpg
```

## Example: Upload ใน Patient Profile

```typescript
// routes/patients/index.ts
fastify.post("/:id/avatar", async (request, reply) => {
  const { id } = request.params;
  const data = await request.file();

  if (!data) {
    return reply.code(400).send({ message: "No file uploaded" });
  }

  const s3Service = new S3Service();
  const buffer = await data.toBuffer();
  const key = s3Service.generateUniqueKey("avatars", data.filename, id);

  const result = await s3Service.uploadFile({
    key,
    body: buffer,
    contentType: data.mimetype,
    acl: "public-read",
  });

  // บันทึก URL ลงฐานข้อมูล
  await patientRepository.update(id, { avatar_url: result.location });

  return reply.send({ success: true, data: result });
});
```
