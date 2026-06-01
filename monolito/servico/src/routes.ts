import { FastifyInstance } from "fastify";
import * as menuItemController from "./controllers/menuItemController";
import * as orderController from "./controllers/orderController";
import * as paymentController from "./controllers/paymentController";
import * as notificationController from "./controllers/notificationController";

export async function routes(app: FastifyInstance) {
  // Cardapio
  app.post("/menu-items", menuItemController.create);
  app.get("/menu-items", menuItemController.index);
  app.get("/menu-items/:id", menuItemController.show);
  app.patch("/menu-items/:id", menuItemController.update);
  app.delete("/menu-items/:id", menuItemController.remove);

  // Pedidos
  app.post("/orders", orderController.create);
  app.get("/orders", orderController.index);
  app.get("/orders/:id", orderController.show);
  app.patch("/orders/:id/cancel", orderController.cancel);

  // Pagamento
  app.post("/payments", paymentController.pay);
  app.get("/payments/:orderId", paymentController.status);

  // Notificacao
  app.get("/notifications", notificationController.index);
}
