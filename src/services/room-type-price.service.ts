import { RoomTypePriceRepository } from "../repositories/room-type-price.repository";
import {
  RoomTypePrice,
  RoomTypePriceCreateBody,
  RoomTypePriceUpdateBody,
  RoomTypePriceQuerystring,
} from "../types/room";
import { PaginatedResponse } from "../types/common";
import { NotFoundError, ConflictError } from "../utils/errors";

export class RoomTypePriceService {
  constructor(private roomTypePriceRepository: RoomTypePriceRepository) {}

  async getAllRoomTypePrices(
    query: RoomTypePriceQuerystring
  ): Promise<PaginatedResponse<RoomTypePrice>> {
    const { limit = 10, page = 1, ...filter } = query;

    const validPage = Math.max(1, Number(page));
    const validLimit = Math.min(Math.max(1, Number(limit)), 100);

    const { data, total } = await this.roomTypePriceRepository.findAll(
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

  async getRoomTypePriceById(id: string): Promise<RoomTypePrice> {
    const roomTypePrice = await this.roomTypePriceRepository.findById(id);
    if (!roomTypePrice) {
      throw new NotFoundError("Room type price not found");
    }
    return roomTypePrice;
  }

  async createRoomTypePrice(
    data: RoomTypePriceCreateBody
  ): Promise<RoomTypePrice> {
    // Check if room_type already exists
    const existing = await this.roomTypePriceRepository.findByRoomType(
      data.room_type
    );
    if (existing) {
      throw new ConflictError("Room type already exists");
    }

    return await this.roomTypePriceRepository.create(data);
  }

  async updateRoomTypePrice(
    id: string,
    data: RoomTypePriceUpdateBody
  ): Promise<RoomTypePrice> {
    const updated = await this.roomTypePriceRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError("Room type price not found");
    }
    return updated;
  }

  async deleteRoomTypePrice(id: string): Promise<void> {
    const deleted = await this.roomTypePriceRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Room type price not found");
    }
  }
}
