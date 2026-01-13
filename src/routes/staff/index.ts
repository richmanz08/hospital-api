import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// Types
interface Staff {
  id: string;
  gender: string;
  full_name_eng: string;
  full_name_th: string;
  nickname: string | null;
  national_id: string;
  role: string;
  age: number | null;
  profile_image_url: string | null;
  hire_date: Date;
  termination_date: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
type StaffWithoutDeleted = Omit<Staff, "deleted_at">;

interface StaffBody {
  full_name_eng: string;
  full_name_th: string;
  nickname?: string;
  national_id: string;
  role: string;
  age?: number;
  profile_image_url?: string;
}

interface StaffParams {
  id: string;
}

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

async function staffRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all staff (excluding soft deleted)
  fastify.get(
    "/",
    async (
      _request: FastifyRequest,
      reply: FastifyReply
    ): Promise<ApiResponse<StaffWithoutDeleted[]>> => {
      try {
        const result = await fastify.db.query<Staff>(
          "SELECT * FROM staff WHERE deleted_at IS NULL ORDER BY created_at DESC"
        );
        return { data: result.rows };
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
    ): Promise<ApiResponse<Staff>> => {
      try {
        const { id } = request.params;
        const result = await fastify.db.query<Staff>(
          "SELECT * FROM staff WHERE id = $1 AND deleted_at IS NULL",
          [id]
        );

        if (result.rows.length === 0) {
          reply.status(404);
          return { error: "Staff not found" };
        }

        return { data: result.rows[0] };
      } catch (err) {
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
    ): Promise<ApiResponse<Staff>> => {
      try {
        const {
          full_name_eng,
          full_name_th,
          nickname,
          national_id,
          role,
          age,
          profile_image_url,
        } = request.body;

        // Validate national_id is 13 digits
        if (!/^\d{13}$/.test(national_id)) {
          reply.status(400);
          return { error: "National ID must be exactly 13 digits" };
        }

        const result = await fastify.db.query<Staff>(
          `INSERT INTO staff (full_name_eng, full_name_th, nickname, national_id, role, age, profile_image_url) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [
            full_name_eng,
            full_name_th,
            nickname,
            national_id,
            role,
            age,
            profile_image_url,
          ]
        );

        reply.status(201);
        return { data: result.rows[0] };
      } catch (err) {
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
    ): Promise<ApiResponse<Staff>> => {
      try {
        const { id } = request.params;
        const {
          full_name_eng,
          full_name_th,
          nickname,
          national_id,
          role,
          age,
          profile_image_url,
        } = request.body;

        // Validate national_id is 13 digits
        if (!/^\d{13}$/.test(national_id)) {
          reply.status(400);
          return { error: "National ID must be exactly 13 digits" };
        }

        const result = await fastify.db.query<Staff>(
          `UPDATE staff 
           SET full_name_eng = $1, full_name_th = $2, nickname = $3, national_id = $4, 
               role = $5, age = $6, profile_image_url = $7, updated_at = NOW()
           WHERE id = $8 AND deleted_at IS NULL
           RETURNING *`,
          [
            full_name_eng,
            full_name_th,
            nickname,
            national_id,
            role,
            age,
            profile_image_url,
            id,
          ]
        );

        if (result.rows.length === 0) {
          reply.status(404);
          return { error: "Staff not found" };
        }

        return { data: result.rows[0] };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );

  // Soft delete staff
  fastify.delete<{ Params: StaffParams }>(
    "/:id",
    async (
      request: FastifyRequest<{ Params: StaffParams }>,
      reply: FastifyReply
    ): Promise<ApiResponse> => {
      try {
        const { id } = request.params;
        const result = await fastify.db.query<Staff>(
          "UPDATE staff SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
          [id]
        );

        if (result.rows.length === 0) {
          reply.status(404);
          return { error: "Staff not found" };
        }

        return { message: "Staff deleted successfully" };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    }
  );
}

export default staffRoutes;
