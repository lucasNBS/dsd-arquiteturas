import { Prisma } from "../generated/prisma/client";
import { db } from "../lib/db";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "../schemas/menuItem";
import { MenuItem } from "../types/menuItem";
import { z } from "zod";

export type CreateMenuItemDTO = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemDTO = z.infer<typeof updateMenuItemSchema>;

export interface MenuItemsRepository {
  create(data: CreateMenuItemDTO): Promise<MenuItem>;
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  save(menuItem: MenuItem): Promise<void>;
  delete(id: string): Promise<void>;
}

export class PrismaMenuItemsRepository implements MenuItemsRepository {
  async create(data: CreateMenuItemDTO): Promise<MenuItem> {
    const item = await db.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
      },
    });
    return {
      ...item,
      price: item.price.toNumber()
    }
  }

  async findAll(): Promise<MenuItem[]> {
    const items = await db.menuItem.findMany();
    return items.map(item => {
      return {
        ...item,
        price: item.price.toNumber()
      }
    })
  }

  async findById(id: string): Promise<MenuItem | null> {
    const item = await db.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      return null
    }

    return {
      ...item,
      price: item?.price.toNumber()
    }
  }

  async save(menuItem: MenuItem): Promise<void> {
    await db.menuItem.update({
      where: { id: menuItem.id },
      data: {
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        available: menuItem.available,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await db.menuItem.delete({
      where: { id },
    });
  }
}