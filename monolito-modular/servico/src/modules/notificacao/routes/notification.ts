import { FastifyInstance } from "fastify";
import { notificationsService } from "../../../container";

export async function notificationRoutes(app: FastifyInstance) {
    app.patch("/notifications/:orderId/done", async (request, reply) => {

        const { orderId } = request.params as {orderId: string;};

        await notificationsService.completeOrder(orderId);

        return reply.status(204).send();
    }
);
}
