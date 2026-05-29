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

export class InMemoryMenuItemsRepository implements MenuItemsRepository {
  private menuItems: MenuItem[] = [];

  async create(data: CreateMenuItemDTO) {
    const menuItem: MenuItem = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      price: data.price,
      available: data.available ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.menuItems.push(menuItem);

    return menuItem;
  }

  async findAll() {
    return this.menuItems;
  }

  async findById(id: string) {
    const item = this.menuItems.find((item) => item.id === id);

    return item ?? null;
  }

  async save(menuItem: MenuItem) {
    const index = this.menuItems.findIndex((item) => item.id === menuItem.id);

    this.menuItems[index] = menuItem;
  }

  async delete(id: string) {
    this.menuItems = this.menuItems.filter((item) => item.id !== id);
  }
}
