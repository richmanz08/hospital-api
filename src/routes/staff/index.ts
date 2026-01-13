import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  StaffBody,
  StaffParams,
  StaffQuery,
  ApiResponse,
  StaffResponse,
  PaginatedResponse,
} from "../../types";
import { StaffRepository } from "../../repositories";
import {
  StaffService,
  ValidationError,
  NotFoundError,
  DuplicateError,
} from "../../services";

async function staffRoutes(fastify: FastifyInstance): Promise<void> {
  // Initialize repository and service
  const staffRepository = new StaffRepository(fastify.db);
  const staffService = new StaffService(staffRepository);

  // Get all staff with pagination, filtering, and search
  fastify.get<{ Querystring: StaffQuery }>(
    "/",
    async (
      request: FastifyRequest<{ Querystring: StaffQuery }>,
      reply: FastifyReply
    ): Promise<PaginatedResponse<StaffResponse> | ApiResponse> => {
      try {
        const { page, limit, search, gender, role, sortBy, sortOrder } =
          request.query;

        const filter = {
          search,
          gender,
          role,
          sortBy,
          sortOrder: sortOrder as "asc" | "desc" | undefined,
        };

        const result = await staffService.getAllStaff(
          filter,
          parseInt(page || "1"),
          parseInt(limit || "10")
        );

        return result;
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Get staff by ID
  fastify.get<{ Params: StaffParams }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: StaffParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse<StaffResponse>> => {
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
    async (
      request: FastifyRequest<{ Body: StaffBody }>,
      reply: FastifyReply
    ): Promise<ApiResponse<StaffResponse>> => {
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
        const data = await staffService.updateStaff(
          request.params.id,
          request.body
        );
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
    async (
      request: FastifyRequest<{ Params: StaffParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse> => {
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
