import { FastifyReply, FastifyRequest } from "fastify";
import {
  cancelOrder,
  createOrder,
  findOrderById,
  listOrders,
} from "../models/order";

interface OrderLineInput {
  menuItemId?: string;
  quantity?: number;
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { table?: number; items?: OrderLineInput[] };

  if (
    typeof body.table !== "number" ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return reply.status(400).send({
      message: "Informe 'table' (number) e 'items' (lista com ao menos 1 item)",
    });
  }

  // O cliente envia apenas menuItemId + quantity; nome e preco sao resolvidos
  // pelo Cardapio dentro de createOrder (acoplamento direto entre dominios).
  const lines = [];
  for (const item of body.items) {
    if (
      !item.menuItemId ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0
    ) {
      return reply.status(400).send({
        message:
          "Cada item precisa de 'menuItemId' (string) e 'quantity' (number > 0)",
      });
    }
    lines.push({ menuItemId: item.menuItemId, quantity: item.quantity });
  }

  try {
    const order = await createOrder({ table: body.table, items: lines });
    return reply.status(201).send(order);
  } catch (err) {
    return reply.status(400).send({ message: (err as Error).message });
  }
}

export async function index() {
  return listOrders();
}

export async function show(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const order = await findOrderById(id);

  if (!order) {
    return reply.status(404).send({ message: "Pedido nao encontrado" });
  }

  return order;
}

export async function cancel(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const order = await cancelOrder(id);

    if (!order) {
      return reply.status(404).send({ message: "Pedido nao encontrado" });
    }

    return reply.send(order);
  } catch (err) {
    return reply.status(409).send({ message: (err as Error).message });
  }
}
