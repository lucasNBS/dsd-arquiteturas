import { z } from "zod";

export const createOrderItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const createOrderSchema = z.object({
  table: z.number().int().positive(),
  items: z.array(createOrderItemSchema).min(1),
});
