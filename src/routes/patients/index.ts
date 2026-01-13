import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  Patient,
  PatientCreateBody,
  PatientUpdateBody,
  PatientParams,
  ApiResponse,
} from "../../types";

async function patientRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all patients
  fastify.get(
    "/",
    async (
      _request: FastifyRequest,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient[]>> => {
      try {
        const patients = await fastify.patientService.getAllPatients();
        return { data: patients };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Get patient by ID
  fastify.get<{ Params: PatientParams }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: PatientParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient>> => {
      try {
        const { id } = request.params;
        const patient = await fastify.patientService.getPatientById(id);
        return { data: patient };
      } catch (err) {
        const error = err as Error;
        if (error.message === "Patient not found") {
          reply.status(404);
        } else {
          reply.status(500);
        }
        return { error: error.message };
      }
    }
  );

  // Create new patient
  fastify.post<{ Body: PatientCreateBody }>(
    "/",
    async (
      request: FastifyRequest<{ Body: PatientCreateBody }>,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient>> => {
      try {
        const patient = await fastify.patientService.createPatient(
          request.body
        );
        reply.status(201);
        return { data: patient };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Update patient
  fastify.put<{ Params: PatientParams; Body: PatientUpdateBody }>(
    "/:id",
    async (
      request: FastifyRequest<{
        Params: PatientParams;
        Body: PatientUpdateBody;
      }>,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient>> => {
      try {
        const { id } = request.params;
        const patient = await fastify.patientService.updatePatient(
          id,
          request.body
        );
        return { data: patient };
      } catch (err) {
        const error = err as Error;
        if (error.message === "Patient not found") {
          reply.status(404);
        } else {
          reply.status(500);
        }
        return { error: error.message };
      }
    }
  );

  // Soft delete patient
  fastify.delete<{ Params: PatientParams }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: PatientParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse> => {
      try {
        const { id } = request.params;
        await fastify.patientService.softDeletePatient(id);
        return { message: "Patient deleted successfully" };
      } catch (err) {
        const error = err as Error;
        if (error.message === "Patient not found") {
          reply.status(404);
        } else {
          reply.status(500);
        }
        return { error: error.message };
      }
    }
  );

  // Hard delete patient (permanent)
  fastify.delete<{ Params: PatientParams }>(
    "/:id/permanent",
    async (
      request: FastifyRequest<{ Params: PatientParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse> => {
      try {
        const { id } = request.params;
        await fastify.patientService.hardDeletePatient(id);
        return { message: "Patient permanently deleted" };
      } catch (err) {
        const error = err as Error;
        if (error.message === "Patient not found") {
          reply.status(404);
        } else {
          reply.status(500);
        }
        return { error: error.message };
      }
    }
  );
}

export default patientRoutes;
