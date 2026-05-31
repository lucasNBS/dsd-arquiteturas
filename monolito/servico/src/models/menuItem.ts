import { db } from "../database";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createMenuItem(data: {
  name: string;
  description?: string;
  price: number;
  available?: boolean;
}): MenuItem {
  const item: MenuItem = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    price: data.price,
    available: data.available ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.menuItems.push(item);

  return item;
}

export function listMenuItems(): MenuItem[] {
  return db.menuItems;
}

export function findMenuItemById(id: string): MenuItem | null {
  return db.menuItems.find((item) => item.id === id) ?? null;
}

export function updateMenuItem(
  id: string,
  data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
): MenuItem | null {
  const item = findMenuItemById(id);

  if (!item) {
    return null;
  }

  Object.assign(item, data, { updatedAt: new Date() });

  return item;
}

export function deleteMenuItem(id: string): boolean {
  const index = db.menuItems.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  db.menuItems.splice(index, 1);

  return true;
}
