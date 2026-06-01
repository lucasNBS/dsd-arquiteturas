import { query } from "../database";

export interface Notification {
  id: string;
  orderId: string;
  paymentId: string;
  target: string;
  message: string;
  createdAt: Date;
}

function mapRow(row: any): Notification {
  return {
    id: row.id,
    orderId: row.order_id,
    paymentId: row.payment_id,
    target: row.target,
    message: row.message,
    createdAt: new Date(row.created_at),
  };
}

export async function createNotification(data: {
  orderId: string;
  paymentId: string;
  target: string;
  message: string;
}): Promise<Notification> {
  const notification: Notification = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    paymentId: data.paymentId,
    target: data.target,
    message: data.message,
    createdAt: new Date(),
  };

  await query(
    `INSERT INTO notifications (id, order_id, payment_id, target, message, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      notification.id,
      notification.orderId,
      notification.paymentId,
      notification.target,
      notification.message,
      notification.createdAt,
    ],
  );

  console.log(`[notificacao] >>> ${data.target}: ${data.message}`);

  return notification;
}

export async function listNotifications(): Promise<Notification[]> {
  const result = await query("SELECT * FROM notifications ORDER BY created_at");
  return result.rows.map(mapRow);
}
