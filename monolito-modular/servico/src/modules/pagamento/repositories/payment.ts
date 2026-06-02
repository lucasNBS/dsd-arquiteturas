import { db } from "../../../shared/database/connection";
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
} from "../schemas/payment";
import { Payment } from "../types/payment";
import { z } from "zod";

export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusDTO = z.infer<typeof updatePaymentStatusSchema>;

export interface PaymentRepository {
  create(data: CreatePaymentDTO): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  save(data: Payment): Promise<void>;
}

export class PostgresPaymentRepository implements PaymentRepository {
  private payments: Payment[] = [];

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const payment: Payment = {
      id: crypto.randomUUID(),
      orderId: data.orderId,
      amount: data.amount,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.query(
      `
      INSERT INTO pagamento.payments
      (
        id,
        order_id,
        amount,
        status,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        payment.id,
        payment.orderId,
        payment.amount,
        payment.status,
        payment.createdAt,
        payment.updatedAt,
      ]
    );

    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await db.query(
      `
      SELECT *
      FROM pagamento.payments
      WHERE id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      orderId: row.order_id,
      amount: Number(row.amount),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async save(data: Payment) {
    await db.query(
      `
      UPDATE pagamento.payments
      SET
        status = $1,
        updated_at = $2
      WHERE id = $3
      `,
      [
        data.status,
        data.updatedAt,
        data.id,
      ]
    );
  }
}
