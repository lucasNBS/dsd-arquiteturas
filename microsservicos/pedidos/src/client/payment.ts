export interface Payment {
  createPayment(total: number, orderId: string): Promise<void>;
}

export class PaymentClient implements Payment {
  async createPayment(total: number, orderId: string): Promise<void> {
    try {
      await fetch(`http://app-pagamento:3002/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          orderId,
        }),
      });
    } catch (err) {
      throw err;
    }
  }
}
