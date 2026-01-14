import { QueryResult, QueryResultRow } from "pg";
import {
  Patient,
  PatientCreateBody,
  PatientFilter,
  PatientUpdateBody,
} from "../types";

// Database interface for dependency injection
interface Database {
  query: <T extends QueryResultRow>(
    text: string,
    params?: any[]
  ) => Promise<QueryResult<T>>;
}

export class PatientRepository {
  constructor(private db: Database) {}

  async findAll(
    filter?: PatientFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Patient[]; total: number }> {
    const conditions: string[] = ["deleted_at IS NULL"];
    const values: any[] = [];
    let paramCount = 1;

    // Filter by search (first_name, last_name, nickname, phone, national_id)
    if (filter?.search) {
      conditions.push(
        `(first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR nickname ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR national_id ILIKE $${paramCount})`
      );
      values.push(`%${filter.search}%`);
      paramCount++;
    }

    // Filter by gender
    if (filter?.gender) {
      conditions.push(`gender = $${paramCount}`);
      values.push(filter.gender);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    // Count query (without pagination parameters)
    const countResult = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM patients 
       WHERE ${whereClause}`,
      values.slice(0, paramCount - 1) // Only filter parameters, no pagination
    );

    // Pagination
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await this.db.query<Patient>(
      `SELECT * FROM patients 
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );
    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async findById(id: string): Promise<Patient | null> {
    const result = await this.db.query<Patient>(
      `SELECT * FROM patients 
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: PatientCreateBody): Promise<Patient> {
    const result = await this.db.query<Patient>(
      `INSERT INTO patients (
        gender, national_id, first_name, last_name, 
        nickname, age, date_of_birth, phone
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.gender,
        data.national_id,
        data.first_name,
        data.last_name,
        data.nickname || null,
        data.age || null,
        data.date_of_birth || null,
        data.phone,
      ]
    );
    return result.rows[0];
  }

  async update(id: string, data: PatientUpdateBody): Promise<Patient | null> {
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.gender !== undefined) {
      fields.push(`gender = $${paramCount++}`);
      values.push(data.gender);
    }
    if (data.first_name !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(data.last_name);
    }
    if (data.nickname !== undefined) {
      fields.push(`nickname = $${paramCount++}`);
      values.push(data.nickname);
    }
    if (data.age !== undefined) {
      fields.push(`age = $${paramCount++}`);
      values.push(data.age);
    }
    if (data.date_of_birth !== undefined) {
      fields.push(`date_of_birth = $${paramCount++}`);
      values.push(data.date_of_birth);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Patient>(
      `UPDATE patients SET ${fields.join(", ")}
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async softDelete(id: string): Promise<Patient | null> {
    const result = await this.db.query<Patient>(
      `UPDATE patients 
       SET deleted_at = NOW() 
       WHERE id = $1 AND deleted_at IS NULL 
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  async hardDelete(id: string): Promise<Patient | null> {
    const result = await this.db.query<Patient>(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }
}
