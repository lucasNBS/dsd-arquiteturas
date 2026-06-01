import { CreatePaymentDTO, PaymentRepository } from "../repositories/payment";
import { Payment } from "../types/payment";

export class PaymentService {
  constructor(private repository: PaymentRepository) {}

  async createPayment(data: CreatePaymentDTO): Promise<Payment> {
    return await this.repository.create(data);
  }

  async list(): Promise<Payment[]> {
    return await this.repository.findAll();
  }

  async markAsPaid(id: string): Promise<Payment | null> {
    const payment = await this.repository.findById(id);

    if (!payment) {
      return null;
    }

    payment.status = "PAID";
    payment.updatedAt = new Date();

    await this.repository.save(payment);

    return payment;
  }
}
