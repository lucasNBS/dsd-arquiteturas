export interface OrderFacade {
  markAsPreparing(orderId: string): Promise<void>;

  markAsDone(orderId: string): Promise<void>;
}

