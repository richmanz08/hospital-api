import { FastifyInstance } from "fastify";
import { Pool, QueryResult, QueryResultRow } from "pg";
import { PatientService } from "../services/patient.service";
import { StaffService } from "../services/staff.service";

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
    patientService: PatientService;
    staffService: StaffService;
  }
}

export {};
