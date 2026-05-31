import { PaymentFacade } from "../contracts/facade";
import { NotificationFacade } from "../../notificacao/contracts/facade";
import { CreatePaymentDTO, PaymentRepository } from "../repositories/payment";
import { Payment } from "../types/payment";

export class PaymentService implements PaymentFacade{
  constructor(private repository: PaymentRepository,
    private notificationFacade: NotificationFacade
  ) {}
  

  async createPayment(data: CreatePaymentDTO): Promise<Payment> {
    return await this.repository.create(data);
  }

  async markAsPaid(id: string): Promise<Payment | null> {
    const payment =await this.repository.findById(id);

    if (!payment) {
      return null;
    }

    payment.status = "PAID";
    payment.updatedAt = new Date();

    await this.repository.save(payment);

    await this.notificationFacade.notifyOrderPaid(payment.orderId, payment.id);

    return payment;
  }
}
