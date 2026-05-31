import { FastifyInstance } from "fastify";

import { PedidoService } from "./pedido.service";
import { PedidoRepository } from "./pedido.repository";
import { createOrderSchema } from "./pedido.schemas";

const pedidoRepository = new PedidoRepository();

const pedidoService = new PedidoService(pedidoRepository);

export async function pedidoRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    try {
      const body = createOrderSchema.parse(request.body);

      const order = await pedidoService.create(body);

      return reply.status(201).send(order);
    } catch (error) {
      console.error("ERRO AO CRIAR PEDIDO:", error);

      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Erro ao criar pedido",
      });
    }
  });

  app.get("/", async () => {
    return pedidoService.list();
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const order = await pedidoService.get(id);

    if (!order) {
      return reply.status(404).send({
        message: "Pedido não encontrado",
      });
    }

    return order;
  });

  app.patch("/:id/cancel", async (request, reply) => {
    const { id } = request.params as { id: string };

    const order = await pedidoService.cancel(id);

    if (!order) {
      return reply.status(404).send({
        message: "Pedido não encontrado",
      });
    }

    return order;
  });
}