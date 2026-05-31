import { db } from "../database";

export type PaymentStatus = "PAID" | "REFUSED";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
}

export function createPayment(data: {
  orderId: string;
  amount: number;
  status: PaymentStatus;
}): Payment {
  const payment: Payment = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    amount: data.amount,
    status: data.status,
    createdAt: new Date(),
  };

  db.payments.push(payment);

  return payment;
}

export function findPaymentByOrderId(orderId: string): Payment | null {
  return db.payments.find((payment) => payment.orderId === orderId) ?? null;
}
