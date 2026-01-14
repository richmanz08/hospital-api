import { FastifyPluginAsync } from "fastify";
import {
  RoomTypePrice,
  RoomTypePriceCreateBody,
  RoomTypePriceUpdateBody,
  RoomTypePriceQuerystring,
} from "../../types/room";
import { PaginatedResponse } from "../../types/common";

const roomTypePriceRoutes: FastifyPluginAsync = async (fastify) => {
  const { roomTypePriceService } = fastify;

  // GET /room-type-prices - Get all room type prices
  fastify.get<{
    Querystring: RoomTypePriceQuerystring;
    Reply: PaginatedResponse<RoomTypePrice>;
  }>("/", async (request, reply) => {
    const prices = await roomTypePriceService.getAllRoomTypePrices(
      request.query
    );
    return reply.send(prices);
  });

  // GET /room-type-prices/:id - Get room type price by ID
  fastify.get<{
    Params: { id: string };
    Reply: RoomTypePrice;
  }>("/:id", async (request, reply) => {
    const price = await roomTypePriceService.getRoomTypePriceById(
      request.params.id
    );
    return reply.send(price);
  });

  // POST /room-type-prices - Create new room type price
  fastify.post<{
    Body: RoomTypePriceCreateBody;
    Reply: RoomTypePrice;
  }>("/", async (request, reply) => {
    const price = await roomTypePriceService.createRoomTypePrice(request.body);
    return reply.code(201).send(price);
  });

  // PUT /room-type-prices/:id - Update room type price
  fastify.put<{
    Params: { id: string };
    Body: RoomTypePriceUpdateBody;
    Reply: RoomTypePrice;
  }>("/:id", async (request, reply) => {
    const price = await roomTypePriceService.updateRoomTypePrice(
      request.params.id,
      request.body
    );
    return reply.send(price);
  });

  // DELETE /room-type-prices/:id - Delete room type price
  fastify.delete<{
    Params: { id: string };
  }>("/:id", async (request, reply) => {
    await roomTypePriceService.deleteRoomTypePrice(request.params.id);
    return reply.code(204).send();
  });
};

export default roomTypePriceRoutes;
