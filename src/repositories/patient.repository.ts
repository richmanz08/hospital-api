import { QueryResult, QueryResultRow } from "pg";
import { Patient, PatientBody } from "../types";

// Database interface for dependency injection
interface Database {
  query: <T extends QueryResultRow>(
    text: string,
    params?: any[]
  ) => Promise<QueryResult<T>>;
}

export class PatientRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<Patient[]> {
    const result = await this.db.query<Patient>(
      "SELECT * FROM patients ORDER BY id"
    );
    return result.rows;
  }

  async findById(id: string): Promise<Patient | null> {
    const result = await this.db.query<Patient>(
      "SELECT * FROM patients WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: PatientBody): Promise<Patient> {
    const result = await this.db.query<Patient>(
      `INSERT INTO patients (first_name, last_name, date_of_birth, phone, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.first_name,
        data.last_name,
        data.date_of_birth || null,
        data.phone || null,
        data.email || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: string, data: PatientBody): Promise<Patient | null> {
    const result = await this.db.query<Patient>(
      `UPDATE patients SET
        first_name = $1,
        last_name = $2,
        date_of_birth = $3,
        phone = $4,
        email = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
      [
        data.first_name,
        data.last_name,
        data.date_of_birth || null,
        data.phone || null,
        data.email || null,
        id,
      ]
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<Patient | null> {
    const result = await this.db.query<Patient>(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }
}
