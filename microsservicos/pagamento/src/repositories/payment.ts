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

export class InMemoryPaymentRepository implements PaymentRepository {
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

    this.payments.push(payment);

    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = this.payments.find((p) => p.id === id);

    return payment ?? null;
  }

  async save(data: Payment) {
    const index = this.payments.findIndex((item) => item.id === data.id);

    this.payments[index] = data;
  }
}
