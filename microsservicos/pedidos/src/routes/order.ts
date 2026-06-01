import { FastifyInstance } from "fastify";
import { createOrderSchema } from "../schemas/order";
import { OrdersService } from "../services/order";
import { PrismaOrdersRepository } from "../repositories/order";
import { MenuItemClient } from "../client/menuItem";
import { PaymentClient } from "../client/payment";

const ordersRepository = new PrismaOrdersRepository();
const menuItemsClient = new MenuItemClient();
const paymentClient = new PaymentClient();
const ordersService = new OrdersService(
  ordersRepository,
  menuItemsClient,
  paymentClient,
);

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", async (request, reply) => {
    const body = createOrderSchema.parse(request.body);

    try {
      const order = await ordersService.create(body);
      return reply.status(201).send(order);
    } catch (err) {
      return reply.status(500).send({ message: err.message });
    }
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
