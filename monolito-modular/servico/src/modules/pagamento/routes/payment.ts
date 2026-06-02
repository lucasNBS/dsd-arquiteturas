import { FastifyInstance } from "fastify";
import { PostgresPaymentRepository } from "../repositories/payment";
import { paymentService } from "../../../container/index";
import { createPaymentSchema } from "../schemas/payment";

const paymentRepository = new PostgresPaymentRepository();

export async function paymentRoutes(app: FastifyInstance) {
  app.post("/payments", async (request, reply) => {
    const body = createPaymentSchema.parse(request.body);
    const payment = await paymentService.createPayment(body);

    return reply.status(201).send(payment);
  });

  app.patch("/payments/:id/pay", async (request, reply) => {
    const params = request.params as { id: string };

    const payment = await paymentService.markAsPaid(params.id);

    if (!payment) {
      return reply.status(404).send({
        message: "Pagamento não encontrado",
      });
    }

    return reply.send(payment);
  });
}
