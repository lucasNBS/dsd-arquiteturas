import { db } from "../database";

export interface Notification {
  id: string;
  orderId: string;
  paymentId: string;
  target: string;
  message: string;
  createdAt: Date;
}

export function createNotification(data: {
  orderId: string;
  paymentId: string;
  target: string;
  message: string;
}): Notification {
  const notification: Notification = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    paymentId: data.paymentId,
    target: data.target,
    message: data.message,
    createdAt: new Date(),
  };

  db.notifications.push(notification);

  console.log(`[notificacao] >>> ${data.target}: ${data.message}`);

  return notification;
}

export function listNotifications(): Notification[] {
  return db.notifications;
}
