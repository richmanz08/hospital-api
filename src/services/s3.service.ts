import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

export interface UploadOptions {
  bucket?: string;
  key: string;
  body: Buffer | Readable;
  contentType?: string;
  acl?: "private" | "public-read" | "public-read-write";
}

export interface UploadResult {
  key: string;
  bucket: string;
  location: string;
  url?: string;
}

export class S3Service {
  private s3Client: S3Client;
  private defaultBucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || "ap-southeast-2";
    this.defaultBucket = process.env.AWS_S3_BUCKET || "";

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  /**
   * อัปโหลดไฟล์ไปยัง S3
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const bucket = options.bucket || this.defaultBucket;

    if (!bucket) {
      throw new Error("S3 bucket is not configured");
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
      // ACL: options.acl || "private", // ปิด ACL ไว้ก่อน
    });

    await this.s3Client.send(command);

    const location = `https://${bucket}.s3.${this.region}.amazonaws.com/${options.key}`;

    return {
      key: options.key,
      bucket,
      location,
    };
  }

  /**
   * ลบไฟล์จาก S3
   */
  async deleteFile(key: string, bucket?: string): Promise<void> {
    const targetBucket = bucket || this.defaultBucket;

    if (!targetBucket) {
      throw new Error("S3 bucket is not configured");
    }

    const command = new DeleteObjectCommand({
      Bucket: targetBucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * สร้าง Presigned URL สำหรับดาวน์โหลดไฟล์ (ระยะเวลาจำกัด)
   */
  async getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
    bucket?: string
  ): Promise<string> {
    const targetBucket = bucket || this.defaultBucket;

    if (!targetBucket) {
      throw new Error("S3 bucket is not configured");
    }

    const command = new GetObjectCommand({
      Bucket: targetBucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * สร้าง Presigned URL สำหรับอัปโหลดไฟล์ (ระยะเวลาจำกัด)
   */
  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
    bucket?: string
  ): Promise<string> {
    const targetBucket = bucket || this.defaultBucket;

    if (!targetBucket) {
      throw new Error("S3 bucket is not configured");
    }

    const command = new PutObjectCommand({
      Bucket: targetBucket,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * สร้าง key ที่ไม่ซ้ำกันสำหรับไฟล์
   */
  generateUniqueKey(folder: string, filename: string, prefix?: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);

    // แยก extension ออกมา
    const lastDotIndex = filename.lastIndexOf(".");
    const extension =
      lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";

    // สร้างชื่อไฟล์ใหม่โดยใช้ timestamp และ random string
    const newFilename = prefix
      ? `${prefix}_${timestamp}_${randomString}${extension}`
      : `${timestamp}_${randomString}${extension}`;

    return `${folder}/${newFilename}`;
  }

  /**
   * ตรวจสอบว่า file เป็น image หรือไม่
   */
  isImageFile(contentType: string): boolean {
    return contentType.startsWith("image/");
  }

  /**
   * ตรวจสอบว่า file เป็น PDF หรือไม่
   */
  isPdfFile(contentType: string): boolean {
    return contentType === "application/pdf";
  }
}
