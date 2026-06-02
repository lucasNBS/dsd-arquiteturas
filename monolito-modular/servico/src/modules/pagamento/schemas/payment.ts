import { z } from "zod";

export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  orderId: z.uuid(),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID"]),
});
