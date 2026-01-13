import { QueryResult, QueryResultRow } from "pg";
import { Staff, StaffBody, StaffFilter } from "../types";

// Database interface for dependency injection
interface Database {
  query: <T extends QueryResultRow>(
    text: string,
    params?: any[]
  ) => Promise<QueryResult<T>>;
}

export class StaffRepository {
  constructor(private db: Database) {}

  async findAll(
    filter?: StaffFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Staff[]; total: number }> {
    const conditions: string[] = ["deleted_at IS NULL"];
    const params: any[] = [];
    let paramIndex = 1;

    // Search by name (eng or th)
    if (filter?.search) {
      conditions.push(
        `(full_name_eng ILIKE $${paramIndex} OR full_name_th ILIKE $${paramIndex})`
      );
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    // Filter by gender
    if (filter?.gender) {
      conditions.push(`gender = $${paramIndex}`);
      params.push(filter.gender);
      paramIndex++;
    }

    // Filter by role
    if (filter?.role) {
      conditions.push(`role = $${paramIndex}`);
      params.push(filter.role);
      paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    // Sort
    const validSortFields = [
      "full_name_eng",
      "full_name_th",
      "created_at",
      "hire_date",
      "role",
    ];
    const sortBy = validSortFields.includes(filter?.sortBy || "")
      ? filter!.sortBy
      : "created_at";
    const sortOrder = filter?.sortOrder === "asc" ? "ASC" : "DESC";

    // Count total
    const countResult = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM staff WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataResult = await this.db.query<Staff>(
      `SELECT * FROM staff WHERE ${whereClause} 
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return { data: dataResult.rows, total };
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
