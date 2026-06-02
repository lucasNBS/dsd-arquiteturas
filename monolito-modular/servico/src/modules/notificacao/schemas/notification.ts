import { z } from "zod";

export const createNotificationSchema = z.object({
  paymentId: z.uuid(),
  orderId: z.uuid(),
});
