import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Pool, QueryResultRow } from "pg";

async function databasePlugin(fastify: FastifyInstance): Promise<void> {
  const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "hospital_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  });

  // Test the connection
  try {
    const client = await pool.connect();
    fastify.log.info("✅ Database connected successfully");
    client.release();
  } catch (err) {
    fastify.log.error(
      `❌ Database connection failed: ${(err as Error).message}`
    );
  }

  // Decorate fastify with db
  fastify.decorate("db", {
    query: <T extends QueryResultRow = any>(text: string, params?: any[]) =>
      pool.query<T>(text, params),
    pool: pool,
  });

  // Close pool on app close
  fastify.addHook("onClose", async () => {
    await pool.end();
    fastify.log.info("Database connection closed");
  });
}

export default fp(databasePlugin, {
  name: "database",
});
