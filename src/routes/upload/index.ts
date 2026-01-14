import { FastifyPluginAsync } from "fastify";
import multipart from "@fastify/multipart";
import { S3Service } from "../../services/s3.service";

const uploadRoutes: FastifyPluginAsync = async (fastify) => {
  // Register multipart plugin
  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1,
    },
  });

  const s3Service = new S3Service();

  // Upload single file
  fastify.post("/", async (request, reply) => {
    try {
      let folder = "public"; // default folder
      let fileData: any = null;

      // อ่านทั้ง fields และ file จาก multipart
      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === "field") {
          // รับ field อื่นๆ เช่น folder
          if (part.fieldname === "folder") {
            folder = part.value as string;
          }
        } else if (part.type === "file") {
          // รับไฟล์
          fileData = part;

          // อ่านไฟล์เป็น buffer ทันที
          const chunks: Buffer[] = [];
          for await (const chunk of part.file) {
            chunks.push(chunk);
          }
          fileData.buffer = Buffer.concat(chunks);
        }
      }

      if (!fileData || !fileData.buffer) {
        return reply.code(400).send({
          success: false,
          message: "No file uploaded",
        });
      }

      // ตรวจสอบ file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];

      if (!fileData.mimetype || !allowedTypes.includes(fileData.mimetype)) {
        return reply.code(400).send({
          success: false,
          message: "Invalid file type. Only images and PDF are allowed",
        });
      }

      const buffer = fileData.buffer;

      // ตรวจสอบขนาดไฟล์ (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (buffer.length > maxSize) {
        return reply.code(400).send({
          success: false,
          message: "File size exceeds 5MB limit",
        });
      }

      // ใช้ folder ที่ได้จาก form-data
      const key = s3Service.generateUniqueKey(folder, fileData.filename);

      // Upload to S3
      const result = await s3Service.uploadFile({
        key,
        body: buffer,
        contentType: fileData.mimetype,
      });

      return reply.code(201).send({
        success: true,
        message: "File uploaded successfully",
        data: result,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: "Failed to upload file",
        error: error.message,
      });
    }
  });

  // Get signed URL for private file
  fastify.get<{
    Querystring: { key: string; expiresIn?: number };
  }>(
    "/signed-url",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["key"],
          properties: {
            key: { type: "string" },
            expiresIn: { type: "number", default: 3600 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { key, expiresIn = 3600 } = request.query;

        const url = await s3Service.getSignedDownloadUrl(key, expiresIn);

        return reply.send({
          success: true,
          data: { url, expiresIn },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          message: "Failed to generate signed URL",
          error: error.message,
        });
      }
    }
  );

  // Delete file
  fastify.delete<{
    Body: { key: string };
  }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["key"],
          properties: {
            key: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { key } = request.body;

        await s3Service.deleteFile(key);

        return reply.send({
          success: true,
          message: "File deleted successfully",
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({
          success: false,
          message: "Failed to delete file",
          error: error.message,
        });
      }
    }
  );
};

export default uploadRoutes;
