import { z } from "zod";

export const createOrderSchema = z.object({
  table: z.number().int().positive(),
  items: z.array(z.string()).min(1),
});
