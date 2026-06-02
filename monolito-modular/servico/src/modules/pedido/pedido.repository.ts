import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "../../shared/database/connection";
import { createOrderSchema } from "./pedido.schemas";

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

export interface Order {
  id: string;
  table_number: number;
  status: string;
  total: number;
  observation: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}

export class PedidoRepository {
  async create(data: CreateOrderDTO): Promise<Order> {
    const orderId = randomUUID();

    let total = 0;

    const orderResult = await db.query<Order>(
      `
      INSERT INTO pedido.orders (
        id,
        table_number,
        status,
        total,
        observation
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [orderId, data.table, "pending", 0, data.observation ?? null]
    );

    for (const item of data.items) {
      const menuItemResult = await db.query<{
        id: string;
        price: number;
      }>(
        `
        SELECT id, price
        FROM cardapio.menu_items
        WHERE id = $1
        `,
        [item.menuItemId]
      );

      const menuItem = menuItemResult.rows[0];

      if (!menuItem) {
        throw new Error(`Item do cardápio não encontrado: ${item.menuItemId}`);
      }

      const unitPrice = Number(menuItem.price);
      const subtotal = unitPrice * item.quantity;

      total += subtotal;

      await db.query(
        `
        INSERT INTO pedido.order_items (
          id,
          order_id,
          menu_item_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          randomUUID(),
          orderId,
          item.menuItemId,
          item.quantity,
          unitPrice,
          subtotal,
        ]
      );
    }

    const updatedOrderResult = await db.query<Order>(
      `
      UPDATE pedido.orders
      SET
        total = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [total, orderId]
    );

    return updatedOrderResult.rows[0];
  }

  async findAll(): Promise<Order[]> {
    const result = await db.query<Order>(
      `
      SELECT *
      FROM pedido.orders
      ORDER BY created_at DESC
      `
    );

    return result.rows;
  }

  async findById(id: string): Promise<Order | null> {
    const result = await db.query<Order>(
      `
      SELECT *
      FROM pedido.orders
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] ?? null;
  }

  async findItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const result = await db.query<OrderItem>(
      `
      SELECT *
      FROM pedido.order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
      `,
      [orderId]
    );

    return result.rows;
  }

  async save(order: Order): Promise<Order> {
    const result = await db.query<Order>(
      `
      UPDATE pedido.orders
      SET
        status = $1,
        total = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [order.status, order.total, order.id]
    );

    return result.rows[0];
  }
}