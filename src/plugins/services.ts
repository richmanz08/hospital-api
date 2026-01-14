import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PatientRepository } from "../repositories/patient.repository";
import { StaffRepository } from "../repositories/staff.repository";
import { RoomRepository } from "../repositories/room.repository";
import { RoomTypePriceRepository } from "../repositories/room-type-price.repository";
import { PatientMedicalInfoRepository } from "../repositories/patient-medical-info.repository";
import { PatientService } from "../services/patient.service";
import { StaffService } from "../services/staff.service";
import { RoomService } from "../services/room.service";
import { RoomTypePriceService } from "../services/room-type-price.service";
import { PatientMedicalInfoService } from "../services/patient-medical-info.service";

const servicesPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Initialize repositories
  const patientRepository = new PatientRepository(fastify.db.pool);
  const staffRepository = new StaffRepository(fastify.db.pool);
  const roomRepository = new RoomRepository(fastify.db.pool);
  const roomTypePriceRepository = new RoomTypePriceRepository(fastify.db.pool);
  const patientMedicalInfoRepository = new PatientMedicalInfoRepository(
    fastify.db.pool
  );

  // Initialize services
  const patientService = new PatientService(patientRepository);
  const staffService = new StaffService(staffRepository);
  const roomService = new RoomService(roomRepository);
  const roomTypePriceService = new RoomTypePriceService(
    roomTypePriceRepository
  );
  const patientMedicalInfoService = new PatientMedicalInfoService(
    patientMedicalInfoRepository
  );

  // Decorate fastify instance with services
  fastify.decorate("patientService", patientService);
  fastify.decorate("staffService", staffService);
  fastify.decorate("roomService", roomService);
  fastify.decorate("roomTypePriceService", roomTypePriceService);
  fastify.decorate("patientMedicalInfoService", patientMedicalInfoService);
};

export default fp(servicesPlugin, {
  name: "services",
  dependencies: ["database"], // Ensure database is loaded first
});
