export interface NotificationFacade {
  notifyOrderPaid(orderId: string, paymentId: string): Promise<void>;
}