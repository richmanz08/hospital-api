import { FastifyInstance } from "fastify";
import { Pool, QueryResult, QueryResultRow } from "pg";

// Extend Fastify types
declare module "fastify" {
  interface FastifyInstance {
    db: {
      query: <T extends QueryResultRow = any>(
        text: string,
        params?: any[]
      ) => Promise<QueryResult<T>>;
      pool: Pool;
    };
  }
}

export {};
