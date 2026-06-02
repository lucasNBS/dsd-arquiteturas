import { z } from "zod";

export const createOrderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  table: z.number().int().positive(),
  items: z.array(createOrderItemSchema).min(1),
  observation: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "done", "cancelled"]),
});