import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

interface HealthCheckResponse {
  status: string;
  database?: string;
  serverTime?: Date;
  error?: string;
  message?: string;
  timestamp?: string;
}

async function routes(fastify: FastifyInstance): Promise<void> {
  // Health check endpoint
  fastify.get(
    "/",
    async (
      _request: FastifyRequest,
      _reply: FastifyReply
    ): Promise<HealthCheckResponse> => {
      return {
        status: "ok",
        message: "Hospital API is running",
        timestamp: new Date().toISOString(),
      };
    }
  );

  // Health check with database
  fastify.get(
    "/health",
    async (
      _request: FastifyRequest,
      reply: FastifyReply
    ): Promise<HealthCheckResponse> => {
      try {
        const result = await fastify.db.query<{ now: Date }>("SELECT NOW()");
        return {
          status: "healthy",
          database: "connected",
          serverTime: result.rows[0].now,
        };
      } catch (err) {
        reply.status(500);
        return {
          status: "unhealthy",
          database: "disconnected",
          error: (err as Error).message,
        };
      }
    }
  );
}

export default routes;
