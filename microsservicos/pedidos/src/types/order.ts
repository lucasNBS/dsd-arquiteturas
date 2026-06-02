export type OrderStatus = "PENDING" | "CANCELLED";

export interface Order {
  id: string;
  table: number;
  items: string[];
  status: OrderStatus;
  observation?: string;
  createdAt: Date;
}
