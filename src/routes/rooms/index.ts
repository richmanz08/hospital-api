import { FastifyPluginAsync } from "fastify";
import {
  Room,
  RoomCreateBody,
  RoomUpdateBody,
  RoomQuerystring,
} from "../../types/room";
import { PaginatedResponse } from "../../types/common";

const roomRoutes: FastifyPluginAsync = async (fastify) => {
  const { roomService } = fastify;

  // GET /rooms - Get all rooms
  fastify.get<{
    Querystring: RoomQuerystring;
    Reply: PaginatedResponse<Room>;
  }>("/", async (request, reply) => {
    const rooms = await roomService.getAllRooms(request.query);
    return reply.send(rooms);
  });

  // GET /rooms/:id - Get room by ID
  fastify.get<{
    Params: { id: string };
    Reply: Room;
  }>("/:id", async (request, reply) => {
    const room = await roomService.getRoomById(Number(request.params.id));
    return reply.send(room);
  });

  // POST /rooms - Create new room
  fastify.post<{
    Body: RoomCreateBody;
    Reply: Room;
  }>("/", async (request, reply) => {
    const room = await roomService.createRoom(request.body);
    return reply.code(201).send(room);
  });

  // PUT /rooms/:id - Update room
  fastify.put<{
    Params: { id: string };
    Body: RoomUpdateBody;
    Reply: Room;
  }>("/:id", async (request, reply) => {
    const room = await roomService.updateRoom(
      Number(request.params.id),
      request.body
    );
    return reply.send(room);
  });

  // DELETE /rooms/:id - Soft delete room
  fastify.delete<{
    Params: { id: string };
  }>("/:id", async (request, reply) => {
    await roomService.deleteRoom(Number(request.params.id));
    return reply.code(204).send();
  });
};

export default roomRoutes;
