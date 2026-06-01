import { FastifyReply, FastifyRequest } from "fastify";
import { createPayment, findPaymentByOrderId } from "../models/payment";
import {
  findOrderById,
  markOrderAsPaid,
  moveOrderToKitchen,
} from "../models/order";
import { createNotification } from "../models/notification";

function blockEventLoop(ms: number): void {
  const buffer = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(buffer, 0, 0, ms);
}

export async function pay(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { orderId?: string };

  if (!body.orderId) {
    return reply.status(400).send({ message: "Informe 'orderId'" });
  }

  const order = await findOrderById(body.orderId);

  if (!order) {
    return reply.status(404).send({ message: "Pedido nao encontrado" });
  }

  if (order.status === "CANCELED") {
    return reply
      .status(400)
      .send({ message: "Pedido cancelado nao pode ser pago" });
  }

  const existing = await findPaymentByOrderId(order.id);
  if (existing && existing.status === "PAID") {
    return reply.status(400).send({ message: "Pedido ja foi pago" });
  }

  console.log(`[pagamento] iniciando processamento do pedido ${order.id}`);

  if (process.env.PAGAMENTO_LENTO === "true") {
    const ms = Number(process.env.PAGAMENTO_SLEEP_MS ?? 5000);
    console.log(`[pagamento] PAGAMENTO_LENTO ativo: bloqueando por ${ms}ms`);
    blockEventLoop(ms);
  }

  const approved = process.env.PAGAMENTO_RECUSAR !== "true";

  const payment = await createPayment({
    orderId: order.id,
    amount: order.amount,
    status: approved ? "PAID" : "REFUSED",
  });

  console.log(`[pagamento] pedido ${order.id}: pagamento ${payment.status}`);

  if (!approved) {
    return reply.status(201).send(payment);
  }

  await markOrderAsPaid(order.id);
  await moveOrderToKitchen(order.id);
  await createNotification({
    orderId: order.id,
    paymentId: payment.id,
    target: "COZINHA",
    message: `Pedido ${order.id} (mesa ${order.table}) pago. Preparar na cozinha.`,
  });

  return reply.status(201).send(payment);
}

export async function status(request: FastifyRequest, reply: FastifyReply) {
  const { orderId } = request.params as { orderId: string };
  const payment = await findPaymentByOrderId(orderId);

  if (!payment) {
    return reply
      .status(404)
      .send({ message: "Nenhum pagamento para este pedido" });
  }

  return payment;
}
