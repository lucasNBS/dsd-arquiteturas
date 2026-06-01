import { FastifyInstance } from "fastify";
import { MenuItemsService } from "../services/menuItem";
import { PrismaMenuItemsRepository } from "../repositories/menuItem";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "../schemas/menuItem";

const menuItemsRepository = new PrismaMenuItemsRepository();
const menuItemsService = new MenuItemsService(menuItemsRepository);

export async function menuItemsRoutes(app: FastifyInstance) {
  app.post("/menu-items", async (request, reply) => {
    const body = createMenuItemSchema.parse(request.body);
    const item = await menuItemsService.create(body);

    return reply.status(201).send(item);
  });

  app.get("/menu-items", async () => {
    return menuItemsService.list();
  });

  app.get("/menu-items/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const item = await menuItemsService.get(params.id);

    if (!item) {
      return reply.status(404).send({
        message: "Item não encontrado",
      });
    }

    return item;
  });

  app.patch("/menu-items/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const body = updateMenuItemSchema.parse(request.body);
    const item = await menuItemsService.update(params.id, body);

    if (!item) {
      return reply.status(404).send({
        message: "Item não encontrado",
      });
    }

    return reply.send(item);
  });

  app.delete("/menu-items/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const deleted = await menuItemsService.delete(params.id);

    if (!deleted) {
      return reply.status(404).send({
        message: "Item não encontrado",
      });
    }

    return reply.status(204).send();
  });
}
