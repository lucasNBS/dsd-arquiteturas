import { db } from "../lib/db";
import { createNotificationSchema } from "../schemas/notification";
import { Notification } from "../types/notification";
import { z } from "zod";

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;

export interface NotificationsRepository {
  create(data: CreateNotificationDTO): Promise<Notification>;
  findAll(): Promise<Notification[]>;
}

export class PrismaNotificationsRepository implements NotificationsRepository {
  async create(data: CreateNotificationDTO): Promise<Notification> {
    const notification = await db.notification.create({
      data: {
        orderId: data.orderId,
        paymentId: data.paymentId,
      },
    });

    return notification;
  }

  async findAll(): Promise<Notification[]> {
    return await db.notification.findMany();
  }
}
