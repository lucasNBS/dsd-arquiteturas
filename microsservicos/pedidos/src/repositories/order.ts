import { createOrderSchema } from "../schemas/order";
import { Order } from "../types/order";
import { z } from "zod";

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

export interface OrdersRepository {
  create(data: CreateOrderDTO): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

export class InMemoryOrdersRepository implements OrdersRepository {
  private orders: Order[] = [];

  async create(data: CreateOrderDTO) {
    const order: Order = {
      id: crypto.randomUUID(),
      table: data.table,
      items: data.items,
      status: "PENDING",
      createdAt: new Date(),
    };

    this.orders.push(order);

    return order;
  }

  async findAll() {
    return this.orders;
  }

  async findById(id: string) {
    const order = this.orders.find((order) => order.id === id);

    return order ?? null;
  }

  async save(order: Order) {
    const orderIndex = this.orders.findIndex((item) => item.id === order.id);

    this.orders[orderIndex] = order;
  }
}
