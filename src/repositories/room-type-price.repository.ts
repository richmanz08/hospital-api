import { Pool } from "pg";
import {
  RoomTypePrice,
  RoomTypePriceCreateBody,
  RoomTypePriceUpdateBody,
  RoomTypePriceFilter,
} from "../types/room";

export class RoomTypePriceRepository {
  constructor(private db: Pool) {}

  async findAll(
    filter?: RoomTypePriceFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: RoomTypePrice[]; total: number }> {
    const conditions: string[] = ["1=1"];
    const values: any[] = [];
    let paramCount = 1;

    // Filter by room_type
    if (filter?.room_type) {
      conditions.push(`room_type = $${paramCount}`);
      values.push(filter.room_type);
      paramCount++;
    }

    // Filter by is_active
    if (filter?.is_active !== undefined) {
      conditions.push(`is_active = $${paramCount}`);
      values.push(filter.is_active);
      paramCount++;
    }

    // Filter by search (name_en, name_th, room_type)
    if (filter?.search) {
      conditions.push(
        `(name_en ILIKE $${paramCount} OR name_th ILIKE $${paramCount} OR room_type ILIKE $${paramCount})`
      );
      values.push(`%${filter.search}%`);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    // Count query
    const countResult = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM room_type_price WHERE ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination parameters
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    // Data query
    const result = await this.db.query<RoomTypePrice>(
      `SELECT * FROM room_type_price 
       WHERE ${whereClause}
       ORDER BY room_type ASC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    return {
      data: result.rows,
      total,
    };
  }

  async findById(id: string): Promise<RoomTypePrice | null> {
    const result = await this.db.query<RoomTypePrice>(
      "SELECT * FROM room_type_price WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async findByRoomType(room_type: string): Promise<RoomTypePrice | null> {
    const result = await this.db.query<RoomTypePrice>(
      "SELECT * FROM room_type_price WHERE room_type = $1",
      [room_type]
    );
    return result.rows[0] || null;
  }

  async create(data: RoomTypePriceCreateBody): Promise<RoomTypePrice> {
    const result = await this.db.query<RoomTypePrice>(
      `INSERT INTO room_type_price (room_type, name_en, name_th, description, base_price_per_day, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.room_type,
        data.name_en,
        data.name_th,
        data.description || null,
        data.base_price_per_day,
        data.is_active ?? true,
      ]
    );
    return result.rows[0];
  }

  async update(
    id: string,
    data: RoomTypePriceUpdateBody
  ): Promise<RoomTypePrice | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name_en !== undefined) {
      fields.push(`name_en = $${paramCount}`);
      values.push(data.name_en);
      paramCount++;
    }

    if (data.name_th !== undefined) {
      fields.push(`name_th = $${paramCount}`);
      values.push(data.name_th);
      paramCount++;
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.base_price_per_day !== undefined) {
      fields.push(`base_price_per_day = $${paramCount}`);
      values.push(data.base_price_per_day);
      paramCount++;
    }

    if (data.is_active !== undefined) {
      fields.push(`is_active = $${paramCount}`);
      values.push(data.is_active);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.db.query<RoomTypePrice>(
      `UPDATE room_type_price 
       SET ${fields.join(", ")}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      "DELETE FROM room_type_price WHERE id = $1",
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}
