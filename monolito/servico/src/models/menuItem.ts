import { query } from "../database";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function mapRow(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    available: row.available,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function createMenuItem(data: {
  name: string;
  description?: string;
  price: number;
  available?: boolean;
}): Promise<MenuItem> {
  const item: MenuItem = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    price: data.price,
    available: data.available ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await query(
    `INSERT INTO menu_items (id, name, description, price, available, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      item.id,
      item.name,
      item.description ?? null,
      item.price,
      item.available,
      item.createdAt,
      item.updatedAt,
    ],
  );

  return item;
}

export async function listMenuItems(): Promise<MenuItem[]> {
  const result = await query("SELECT * FROM menu_items ORDER BY created_at");
  return result.rows.map(mapRow);
}

export async function findMenuItemById(id: string): Promise<MenuItem | null> {
  const result = await query("SELECT * FROM menu_items WHERE id = $1", [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function updateMenuItem(
  id: string,
  data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
): Promise<MenuItem | null> {
  const current = await findMenuItemById(id);

  if (!current) {
    return null;
  }

  const updated: MenuItem = {
    ...current,
    ...data,
    updatedAt: new Date(),
  };

  await query(
    `UPDATE menu_items
        SET name = $1, description = $2, price = $3, available = $4, updated_at = $5
      WHERE id = $6`,
    [
      updated.name,
      updated.description ?? null,
      updated.price,
      updated.available,
      updated.updatedAt,
      id,
    ],
  );

  return updated;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const result = await query("DELETE FROM menu_items WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
