import { FastifyReply, FastifyRequest } from "fastify";
import {
  createMenuItem,
  deleteMenuItem,
  findMenuItemById,
  listMenuItems,
  updateMenuItem,
} from "../models/menuItem";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    name?: string;
    description?: string;
    price?: number;
    available?: boolean;
  };

  if (!body.name || typeof body.price !== "number") {
    return reply
      .status(400)
      .send({ message: "Informe 'name' (string) e 'price' (number)" });
  }

  const item = await createMenuItem({
    name: body.name,
    description: body.description,
    price: body.price,
    available: body.available,
  });

  return reply.status(201).send(item);
}

export async function index() {
  return listMenuItems();
}

export async function show(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const item = await findMenuItemById(id);

  if (!item) {
    return reply.status(404).send({ message: "Item nao encontrado" });
  }

  return item;
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const body = request.body as Record<string, unknown>;

  const item = await updateMenuItem(id, body);

  if (!item) {
    return reply.status(404).send({ message: "Item nao encontrado" });
  }

  return reply.send(item);
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const deleted = await deleteMenuItem(id);

  if (!deleted) {
    return reply.status(404).send({ message: "Item nao encontrado" });
  }

  return reply.status(204).send();
}
