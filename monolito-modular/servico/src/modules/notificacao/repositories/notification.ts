import { db } from "../../../shared/database/connection";
import { createNotificationSchema } from "../schemas/notification";
import { Notification } from "../types/notification";
import { z } from "zod";

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;

export interface NotificationsRepository {
  create(data: CreateNotificationDTO): Promise<Notification>;
}

export class PostgresNotificationsRepository implements NotificationsRepository {

  async create(data: CreateNotificationDTO) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      orderId: data.orderId,
      paymentId: data.paymentId,
      createdAt: new Date(),
    };

    await db.query(
      `
      INSERT INTO notificacao.notifications
      (
        id,
        order_id,
        payment_id,
        created_at
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        notification.id,
        notification.orderId,
        notification.paymentId,
        notification.createdAt,
      ]
    );

    return notification;
  }
}
