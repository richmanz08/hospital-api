import { RoomRepository } from "../repositories/room.repository";
import {
  Room,
  RoomCreateBody,
  RoomUpdateBody,
  RoomQuerystring,
} from "../types/room";
import { PaginatedResponse } from "../types/common";
import { NotFoundError, ConflictError } from "../utils/errors";

export class RoomService {
  constructor(private roomRepository: RoomRepository) {}

  async getAllRooms(query: RoomQuerystring): Promise<PaginatedResponse<Room>> {
    const { limit = 10, page = 1, ...filter } = query;

    const validPage = Math.max(1, Number(page));
    const validLimit = Math.min(Math.max(1, Number(limit)), 100);

    const { data, total } = await this.roomRepository.findAll(
      filter,
      validPage,
      validLimit
    );

    return {
      data,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundError("Room not found");
    }
    return room;
  }

  async createRoom(data: RoomCreateBody): Promise<Room> {
    // Check if room_number already exists
    const existingRoom = await this.roomRepository.findByRoomNumber(
      data.room_number
    );
    if (existingRoom) {
      throw new ConflictError("Room number already exists");
    }

    return await this.roomRepository.create(data);
  }

  async updateRoom(id: number, data: RoomUpdateBody): Promise<Room> {
    // Check if room exists
    const existingRoom = await this.roomRepository.findById(id);
    if (!existingRoom) {
      throw new NotFoundError("Room not found");
    }

    // Check if room_number already exists (if updating room_number)
    if (data.room_number) {
      const roomWithSameNumber = await this.roomRepository.findByRoomNumber(
        data.room_number
      );
      if (roomWithSameNumber && roomWithSameNumber.id !== id) {
        throw new ConflictError("Room number already exists");
      }
    }

    const updated = await this.roomRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError("Room not found");
    }

    return updated;
  }

  async deleteRoom(id: number): Promise<void> {
    const deleted = await this.roomRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Room not found");
    }
  }
}
