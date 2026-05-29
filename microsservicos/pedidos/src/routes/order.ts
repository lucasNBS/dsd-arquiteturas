import { FastifyInstance } from "fastify";
import { createOrderSchema } from "../schemas/order";
import { OrdersService } from "../services/order";
import { InMemoryOrdersRepository } from "../repositories/order";

const ordersRepository = new InMemoryOrdersRepository();
const ordersService = new OrdersService(ordersRepository);

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", async (request, reply) => {
    const body = createOrderSchema.parse(request.body);

    const order = await ordersService.create(body);

    return reply.status(201).send(order);
  });

  app.get("/orders", async () => {
    return await ordersService.list();
  });

  app.patch("/orders/:id/cancel", async (request, reply) => {
    const params = request.params as { id: string };

    const order = await ordersService.cancel(params.id);

    if (!order) {
      return reply.status(404).send({
        message: "Pedido não encontrado",
      });
    }

    return reply.send(order);
  });
}
