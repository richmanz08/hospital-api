import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { StaffBody, StaffParams, ApiResponse, StaffResponse } from "../../types";
import { StaffRepository } from "../../repositories";
import { StaffService, ValidationError, NotFoundError, DuplicateError } from "../../services";

async function staffRoutes(fastify: FastifyInstance): Promise<void> {
  // Initialize repository and service
  const staffRepository = new StaffRepository(fastify.db);
  const staffService = new StaffService(staffRepository);

  // Get all staff
  fastify.get(
    "/",
    async (_request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse<StaffResponse[]>> => {
      try {
        const data = await staffService.getAllStaff();
        return { data };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Get staff by ID
  fastify.get<{ Params: StaffParams }>(
    "/:id",
    async (request: FastifyRequest<{ Params: StaffParams }>, reply: FastifyReply): Promise<ApiResponse<StaffResponse>> => {
      try {
        const data = await staffService.getStaffById(request.params.id);
        return { data };
      } catch (err) {
        if (err instanceof NotFoundError) {
          reply.status(404);
          return { error: err.message };
        }
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Create new staff
  fastify.post<{ Body: StaffBody }>(
    "/",
    async (request: FastifyRequest<{ Body: StaffBody }>, reply: FastifyReply): Promise<ApiResponse<StaffResponse>> => {
      try {
        const data = await staffService.createStaff(request.body);
        reply.status(201);
        return { data };
      } catch (err) {
        if (err instanceof ValidationError) {
          reply.status(400);
          return { error: err.message };
        }
        if (err instanceof DuplicateError) {
          reply.status(409);
          return { error: err.message };
        }
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Update staff
  fastify.put<{ Params: StaffParams; Body: StaffBody }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: StaffParams; Body: StaffBody }>,
      reply: FastifyReply
    ): Promise<ApiResponse<StaffResponse>> => {
      try {
        const data = await staffService.updateStaff(request.params.id, request.body);
        return { data };
      } catch (err) {
        if (err instanceof ValidationError) {
          reply.status(400);
          return { error: err.message };
        }
        if (err instanceof NotFoundError) {
          reply.status(404);
          return { error: err.message };
        }
        if (err instanceof DuplicateError) {
          reply.status(409);
          return { error: err.message };
        }
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Delete staff (soft delete)
  fastify.delete<{ Params: StaffParams }>(
    "/:id",
    async (request: FastifyRequest<{ Params: StaffParams }>, reply: FastifyReply): Promise<ApiResponse> => {
      try {
        await staffService.deleteStaff(request.params.id);
        return { message: "Staff deleted successfully" };
      } catch (err) {
        if (err instanceof NotFoundError) {
          reply.status(404);
          return { error: err.message };
        }
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );
}

export default staffRoutes;
