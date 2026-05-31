import { FastifyInstance } from "fastify";

import { CardapioService } from "./cardapio.service";
import { CardapioRepository } from "./cardapio.repository";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "./cardapio.schemas";

const cardapioRepository = new CardapioRepository();
const cardapioService = new CardapioService(cardapioRepository);

export async function cardapioRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const body = createMenuItemSchema.parse(request.body);

    const item = await cardapioService.create(body);

    return reply.status(201).send(item);
  });

  app.get("/", async () => {
    return cardapioService.list();
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const item = await cardapioService.get(id);

    if (!item) {
      return reply.status(404).send({
        message: "Item não encontrado",
      });
    }

    return item;
  });

  app.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const body = updateMenuItemSchema.parse(request.body);

    const item = await cardapioService.update(id, body);

    if (!item) {
      return reply.status(404).send({
        message: "Item não encontrado",
      });
    }

    return item;
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const deleted = await cardapioService.delete(id);

    if (!deleted) {
      return reply.status(404).send({
        message: "Item não encontrado",
      });
    }

    return reply.status(204).send();
  });
}