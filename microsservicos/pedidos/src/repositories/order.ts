import { db } from "../lib/db";
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

export class PrismaOrdersRepository implements OrdersRepository {
  async create(data: CreateOrderDTO): Promise<Order> {
    return await db.order.create({
      data: {
        table: data.table,
        items: data.items,
        observation: data.observation,
      },
    });
  }

  async findAll(): Promise<Order[]> {
    return await db.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await db.order.findUnique({
      where: {
        id,
      },
    });
  }

  async save(order: Order): Promise<void> {
    await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        table: order.table,
        items: order.items,
        status: order.status,
        observation: order.observation,
      },
    });
  }
}