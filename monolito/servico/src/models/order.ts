import { db } from "../database";
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
  createdAt: Date;
}

export function createOrder(data: {
  table: number;
  items: { menuItemId: string; quantity: number }[];
}): Order {
  const items: OrderItem[] = [];

  // Para cada linha do pedido, busca o item no Cardapio (chamada direta).
  for (const line of data.items) {
    const menuItem = findMenuItemById(line.menuItemId);

    if (!menuItem) {
      throw new Error(`Item ${line.menuItemId} nao existe no cardapio`);
    }

    if (!menuItem.available) {
      throw new Error(`Item '${menuItem.name}' esta indisponivel`);
    }

    // Nome e preco vem do cardapio, nao do cliente.
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
    createdAt: new Date(),
  };

  db.orders.push(order);

  return order;
}

export function listOrders(): Order[] {
  return db.orders;
}

export function findOrderById(id: string): Order | null {
  return db.orders.find((order) => order.id === id) ?? null;
}

export function cancelOrder(id: string): Order | null {
  const order = findOrderById(id);

  if (!order) {
    return null;
  }

  if (order.status === "IN_KITCHEN") {
    throw new Error("Pedido ja esta na cozinha e nao pode ser cancelado");
  }

  order.status = "CANCELED";

  return order;
}

export function markOrderAsPaid(id: string): Order | null {
  const order = findOrderById(id);

  if (!order) {
    return null;
  }

  order.status = "PAID";

  return order;
}

export function moveOrderToKitchen(id: string): Order | null {
  const order = findOrderById(id);

  if (!order) {
    return null;
  }

  order.status = "IN_KITCHEN";

  return order;
}
