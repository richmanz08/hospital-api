import { FastifyPluginAsync } from "fastify";
import multipart from "@fastify/multipart";

const multipartPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1, // จำนวนไฟล์สูงสุดที่อัปโหลดได้ในครั้งเดียว
    },
  });
};

export default multipartPlugin;
