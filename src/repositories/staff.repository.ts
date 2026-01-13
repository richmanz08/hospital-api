import { QueryResult, QueryResultRow } from "pg";
import { Staff, StaffBody } from "../types";

// Database interface for dependency injection
interface Database {
  query: <T extends QueryResultRow>(
    text: string,
    params?: any[]
  ) => Promise<QueryResult<T>>;
}

export class StaffRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<Staff[]> {
    const result = await this.db.query<Staff>(
      "SELECT * FROM staff WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async findById(id: string): Promise<Staff | null> {
    const result = await this.db.query<Staff>(
      "SELECT * FROM staff WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    return result.rows[0] || null;
  }

  async findByNationalId(nationalId: string): Promise<Staff | null> {
    const result = await this.db.query<Staff>(
      "SELECT * FROM staff WHERE national_id = $1 AND deleted_at IS NULL",
      [nationalId]
    );
    return result.rows[0] || null;
  }

  async findByPhone(phone: string): Promise<Staff | null> {
    const result = await this.db.query<Staff>(
      "SELECT * FROM staff WHERE phone = $1 AND deleted_at IS NULL",
      [phone]
    );
    return result.rows[0] || null;
  }

  async create(data: StaffBody): Promise<Staff> {
    const result = await this.db.query<Staff>(
      `INSERT INTO staff (
        full_name_eng, full_name_th, nickname, national_id, phone,
        gender, role, age, profile_image_url, hire_date, termination_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.full_name_eng,
        data.full_name_th,
        data.nickname || null,
        data.national_id,
        data.phone,
        data.gender,
        data.role,
        data.age || null,
        data.profile_image_url || null,
        data.hire_date,
        data.termination_date || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: string, data: StaffBody): Promise<Staff | null> {
    const result = await this.db.query<Staff>(
      `UPDATE staff SET
        full_name_eng = $1,
        full_name_th = $2,
        nickname = $3,
        national_id = $4,
        phone = $5,
        gender = $6,
        role = $7,
        age = $8,
        profile_image_url = $9,
        hire_date = $10,
        termination_date = $11,
        updated_at = NOW()
      WHERE id = $12 AND deleted_at IS NULL
      RETURNING *`,
      [
        data.full_name_eng,
        data.full_name_th,
        data.nickname || null,
        data.national_id,
        data.phone,
        data.gender,
        data.role,
        data.age || null,
        data.profile_image_url || null,
        data.hire_date,
        data.termination_date || null,
        id,
      ]
    );
    return result.rows[0] || null;
  }

  async softDelete(id: string): Promise<Staff | null> {
    const result = await this.db.query<Staff>(
      "UPDATE staff SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }
}
