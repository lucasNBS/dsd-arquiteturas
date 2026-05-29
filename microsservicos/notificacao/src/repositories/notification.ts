import { createNotificationSchema } from "../schemas/notification";
import { Notification } from "../types/notification";
import { z } from "zod";

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;

export interface NotificationsRepository {
  create(data: CreateNotificationDTO): Promise<Notification>;
}

export class InMemoryNotificationsRepository implements NotificationsRepository {
  private notifications: Notification[] = [];

  async create(data: CreateNotificationDTO) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      orderId: data.orderId,
      paymentId: data.paymentId,
      createdAt: new Date(),
    };

    this.notifications.push(notification);

    return notification;
  }
}
