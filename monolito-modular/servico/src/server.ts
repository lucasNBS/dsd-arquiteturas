import "dotenv/config";
import Fastify from "fastify";
import { paymentRoutes } from "./modules/pagamento/routes/payment";

import { cardapioRoutes } from "./modules/cardapio/cardapio.routes";
import { pedidoRoutes } from "./modules/pedido/pedido.routes";
import { notificationRoutes } from "./modules/notificacao/routes/notification";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(cardapioRoutes, {
  prefix: "/cardapio",
});

app.register(pedidoRoutes, {
  prefix: "/pedidos",
});

app.register(paymentRoutes);

app.register(notificationRoutes)

const PORT = Number(process.env.PORT) || 8080;

const start = async () => {
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();