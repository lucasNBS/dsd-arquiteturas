export type OrderStatus = "PENDING" | "CANCELED";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  table: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
}
