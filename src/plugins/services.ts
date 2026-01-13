import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PatientRepository } from "../repositories/patient.repository";
import { StaffRepository } from "../repositories/staff.repository";
import { PatientService } from "../services/patient.service";
import { StaffService } from "../services/staff.service";

const servicesPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Initialize repositories
  const patientRepository = new PatientRepository(fastify.db);
  const staffRepository = new StaffRepository(fastify.db);

  // Initialize services
  const patientService = new PatientService(patientRepository);
  const staffService = new StaffService(staffRepository);

  // Decorate fastify instance with services
  fastify.decorate("patientService", patientService);
  fastify.decorate("staffService", staffService);
};

export default fp(servicesPlugin, {
  name: "services",
  dependencies: ["database"], // Ensure database is loaded first
});
