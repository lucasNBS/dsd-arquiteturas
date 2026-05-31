import { z } from "zod";
import { db } from "../shared/database/connection";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "./cardapio.schemas";

export type CreateMenuItemDTO = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemDTO = z.infer<typeof updateMenuItemSchema>;

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardapioRepositoryContract {
  create(data: CreateMenuItemDTO): Promise<MenuItem>;
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  save(menuItem: MenuItem): Promise<void>;
  delete(id: string): Promise<void>;
}

function mapRowToMenuItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    available: row.available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class CardapioRepository implements CardapioRepositoryContract {
  async create(data: CreateMenuItemDTO): Promise<MenuItem> {
    const id = crypto.randomUUID();
    const now = new Date();

    const result = await db.query(
      `
        INSERT INTO cardapio.menu_items (
          id,
          name,
          description,
          price,
          available,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        id,
        data.name,
        data.description ?? null,
        data.price,
        data.available ?? true,
        now,
        now,
      ]
    );

    return mapRowToMenuItem(result.rows[0]);
  }

  async findAll(): Promise<MenuItem[]> {
    const result = await db.query(
      `
        SELECT *
        FROM cardapio.menu_items
        ORDER BY created_at DESC
      `
    );

    return result.rows.map(mapRowToMenuItem);
  }

  async findById(id: string): Promise<MenuItem | null> {
    const result = await db.query(
      `
        SELECT *
        FROM cardapio.menu_items
        WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapRowToMenuItem(result.rows[0]);
  }

  async save(menuItem: MenuItem): Promise<void> {
    await db.query(
      `
        UPDATE cardapio.menu_items
        SET
          name = $1,
          description = $2,
          price = $3,
          available = $4,
          updated_at = $5
        WHERE id = $6
      `,
      [
        menuItem.name,
        menuItem.description ?? null,
        menuItem.price,
        menuItem.available,
        new Date(),
        menuItem.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await db.query(
      `
        DELETE FROM cardapio.menu_items
        WHERE id = $1
      `,
      [id]
    );
  }
}