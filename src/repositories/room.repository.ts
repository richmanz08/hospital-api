import { Pool } from "pg";
import {
  Room,
  RoomCreateBody,
  RoomUpdateBody,
  RoomFilter,
} from "../types/room";

export class RoomRepository {
  constructor(private db: Pool) {}

  async findAll(
    filter?: RoomFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Room[]; total: number }> {
    const conditions: string[] = ["deleted_at IS NULL"];
    const values: any[] = [];
    let paramCount = 1;

    // Filter by room_type
    if (filter?.room_type) {
      conditions.push(`room_type = $${paramCount}`);
      values.push(filter.room_type);
      paramCount++;
    }

    // Filter by building
    if (filter?.building) {
      conditions.push(`building ILIKE $${paramCount}`);
      values.push(`%${filter.building}%`);
      paramCount++;
    }

    // Filter by floor
    if (filter?.floor !== undefined) {
      conditions.push(`floor = $${paramCount}`);
      values.push(filter.floor);
      paramCount++;
    }

    // Filter by is_active
    if (filter?.is_active !== undefined) {
      conditions.push(`is_active = $${paramCount}`);
      values.push(filter.is_active);
      paramCount++;
    }

    // Filter by search (room_number, building)
    if (filter?.search) {
      conditions.push(
        `(room_number ILIKE $${paramCount} OR building ILIKE $${paramCount})`
      );
      values.push(`%${filter.search}%`);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    // Count query
    const countResult = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM room WHERE ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination parameters
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    // Data query
    const result = await this.db.query<Room>(
      `SELECT * FROM room 
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    return {
      data: result.rows,
      total,
    };
  }

  async findById(id: number): Promise<Room | null> {
    const result = await this.db.query<Room>(
      "SELECT * FROM room WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    return result.rows[0] || null;
  }

  async findByRoomNumber(room_number: string): Promise<Room | null> {
    const result = await this.db.query<Room>(
      "SELECT * FROM room WHERE room_number = $1 AND deleted_at IS NULL",
      [room_number]
    );
    return result.rows[0] || null;
  }

  async create(data: RoomCreateBody): Promise<Room> {
    const result = await this.db.query<Room>(
      `INSERT INTO room (room_number, building, floor, room_type, capacity, facilities, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.room_number,
        data.building,
        data.floor,
        data.room_type,
        data.capacity,
        data.facilities || [],
        data.is_active ?? true,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, data: RoomUpdateBody): Promise<Room | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.room_number !== undefined) {
      fields.push(`room_number = $${paramCount}`);
      values.push(data.room_number);
      paramCount++;
    }

    if (data.building !== undefined) {
      fields.push(`building = $${paramCount}`);
      values.push(data.building);
      paramCount++;
    }

    if (data.floor !== undefined) {
      fields.push(`floor = $${paramCount}`);
      values.push(data.floor);
      paramCount++;
    }

    if (data.room_type !== undefined) {
      fields.push(`room_type = $${paramCount}`);
      values.push(data.room_type);
      paramCount++;
    }

    if (data.capacity !== undefined) {
      fields.push(`capacity = $${paramCount}`);
      values.push(data.capacity);
      paramCount++;
    }

    if (data.facilities !== undefined) {
      fields.push(`facilities = $${paramCount}`);
      values.push(data.facilities);
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

    const result = await this.db.query<Room>(
      `UPDATE room 
       SET ${fields.join(", ")}
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query(
      `UPDATE room 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}
