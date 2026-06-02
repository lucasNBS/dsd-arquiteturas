import { CreatePaymentDTO } from "../repositories/payment";
import { Payment } from "../types/payment";

export interface PaymentFacade {
  createPayment(data: CreatePaymentDTO): Promise<Payment>;
}