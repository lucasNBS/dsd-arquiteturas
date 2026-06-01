import { query } from "../database";

export type PaymentStatus = "PAID" | "REFUSED";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
}

function mapRow(row: any): Payment {
  return {
    id: row.id,
    orderId: row.order_id,
    amount: Number(row.amount),
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

export async function createPayment(data: {
  orderId: string;
  amount: number;
  status: PaymentStatus;
}): Promise<Payment> {
  const payment: Payment = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    amount: data.amount,
    status: data.status,
    createdAt: new Date(),
  };

  await query(
    `INSERT INTO payments (id, order_id, amount, status, created_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [payment.id, payment.orderId, payment.amount, payment.status, payment.createdAt],
  );

  return payment;
}

export async function findPaymentByOrderId(
  orderId: string,
): Promise<Payment | null> {
  const result = await query(
    "SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1",
    [orderId],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}
