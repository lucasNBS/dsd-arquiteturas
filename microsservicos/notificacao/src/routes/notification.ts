import { FastifyInstance } from "fastify";
import { PrismaNotificationsRepository } from "../repositories/notification";
import { NotificationsService } from "../services/notification";

const notificationRepository = new PrismaNotificationsRepository();
const notificationService = new NotificationsService(notificationRepository);

export async function notificationRoutes(app: FastifyInstance) {
  app.get("/notification", async () => {
    return await notificationService.list();
  });
}
