import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Patient, PatientBody, PatientParams, ApiResponse } from "../../types";

async function patientRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all patients
  fastify.get(
    "/",
    async (
      _request: FastifyRequest,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient[]>> => {
      try {
        const result = await fastify.db.query<Patient>(
          "SELECT * FROM patients ORDER BY id"
        );
        return { data: result.rows };
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
        const result = await fastify.db.query<Patient>(
          "SELECT * FROM patients WHERE id = $1",
          [id]
        );

        if (result.rows.length === 0) {
          reply.status(404);
          return { error: "Patient not found" };
        }

        return { data: result.rows[0] };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Create new patient
  fastify.post<{ Body: PatientBody }>(
    "/",
    async (
      request: FastifyRequest<{ Body: PatientBody }>,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient>> => {
      try {
        const { first_name, last_name, date_of_birth, phone, email } =
          request.body;

        const result = await fastify.db.query<Patient>(
          `INSERT INTO patients (first_name, last_name, date_of_birth, phone, email) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING *`,
          [first_name, last_name, date_of_birth, phone, email]
        );

        reply.status(201);
        return { data: result.rows[0] };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Update patient
  fastify.put<{ Params: PatientParams; Body: PatientBody }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: PatientParams; Body: PatientBody }>,
      reply: FastifyReply
    ): Promise<ApiResponse<Patient>> => {
      try {
        const { id } = request.params;
        const { first_name, last_name, date_of_birth, phone, email } =
          request.body;

        const result = await fastify.db.query<Patient>(
          `UPDATE patients 
           SET first_name = $1, last_name = $2, date_of_birth = $3, phone = $4, email = $5, updated_at = NOW()
           WHERE id = $6 
           RETURNING *`,
          [first_name, last_name, date_of_birth, phone, email, id]
        );

        if (result.rows.length === 0) {
          reply.status(404);
          return { error: "Patient not found" };
        }

        return { data: result.rows[0] };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Delete patient
  fastify.delete<{ Params: PatientParams }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: PatientParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse> => {
      try {
        const { id } = request.params;
        const result = await fastify.db.query<Patient>(
          "DELETE FROM patients WHERE id = $1 RETURNING *",
          [id]
        );

        if (result.rows.length === 0) {
          reply.status(404);
          return { error: "Patient not found" };
        }

        return { message: "Patient deleted successfully" };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );
}

export default patientRoutes;
