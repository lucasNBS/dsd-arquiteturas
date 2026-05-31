import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().positive("O preço deve ser maior que zero"),
  available: z.boolean().default(true),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").optional(),
  description: z.string().optional(),
  price: z.number().positive("O preço deve ser maior que zero").optional(),
  available: z.boolean().optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;