import { pool, query } from "../database";
import { findMenuItemById } from "./menuItem";

export type OrderStatus = "PENDING" | "PAID" | "IN_KITCHEN" | "CANCELED";

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  table: number;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  note: string | null;
  createdAt: Date;
}

async function loadItems(orderId: string): Promise<OrderItem[]> {
  const result = await query(
    "SELECT * FROM order_items WHERE order_id = $1 ORDER BY id",
    [orderId],
  );
  return result.rows.map((row: any) => ({
    menuItemId: row.menu_item_id,
    name: row.name,
    quantity: row.quantity,
    price: Number(row.price),
  }));
}

async function mapRow(row: any): Promise<Order> {
  return {
    id: row.id,
    table: row.table_num,
    items: await loadItems(row.id),
    amount: Number(row.amount),
    status: row.status,
    note: row.note ?? null,
    createdAt: new Date(row.created_at),
  };
}

export async function createOrder(data: {
  table: number;
  items: { menuItemId: string; quantity: number }[];
  note?: string;
}): Promise<Order> {
  const items: OrderItem[] = [];

  for (const line of data.items) {
    const menuItem = await findMenuItemById(line.menuItemId);

    if (!menuItem) {
      throw new Error(`Item ${line.menuItemId} nao existe no cardapio`);
    }

    if (!menuItem.available) {
      throw new Error(`Item '${menuItem.name}' esta indisponivel`);
    }

    items.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity: line.quantity,
      price: menuItem.price,
    });
  }

  const amount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const order: Order = {
    id: crypto.randomUUID(),
    table: data.table,
    items,
    amount,
    status: "PENDING",
    note: data.note ?? null,
    createdAt: new Date(),
  };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO orders (id, table_num, amount, status, note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [order.id, order.table, order.amount, order.status, order.note, order.createdAt],
    );
    for (const item of order.items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.menuItemId, item.name, item.quantity, item.price],
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return order;
}

export async function listOrders(): Promise<Order[]> {
  const result = await query("SELECT * FROM orders ORDER BY created_at");
  return Promise.all(result.rows.map(mapRow));
}

export async function findOrderById(id: string): Promise<Order | null> {
  const result = await query("SELECT * FROM orders WHERE id = $1", [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function setStatus(id: string, status: OrderStatus): Promise<void> {
  await query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
}

export async function cancelOrder(id: string): Promise<Order | null> {
  const order = await findOrderById(id);

  if (!order) {
    return null;
  }

  if (order.status === "IN_KITCHEN") {
    throw new Error("Pedido ja esta na cozinha e nao pode ser cancelado");
  }

  await setStatus(id, "CANCELED");
  return findOrderById(id);
}

export async function markOrderAsPaid(id: string): Promise<Order | null> {
  if (!(await findOrderById(id))) {
    return null;
  }

  await setStatus(id, "PAID");
  return findOrderById(id);
}

export async function moveOrderToKitchen(id: string): Promise<Order | null> {
  if (!(await findOrderById(id))) {
    return null;
  }

  await setStatus(id, "IN_KITCHEN");
  return findOrderById(id);
}
