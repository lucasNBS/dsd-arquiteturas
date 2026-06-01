import { db } from "../lib/db";
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

export class PrismaPaymentRepository implements PaymentRepository {
  async create(data: CreatePaymentDTO): Promise<Payment> {
    const payment = await db.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
      },
    });

    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await db.payment.findUnique({
      where: { id },
    });

    return payment;
  }

  async save(data: Payment): Promise<void> {
    await db.payment.update({
      where: { id: data.id },
      data: {
        orderId: data.orderId,
        amount: data.amount,
        status: data.status,
        updatedAt: data.updatedAt,
      },
    });
  }
}