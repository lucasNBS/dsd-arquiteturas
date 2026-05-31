import "dotenv/config";
import Fastify from "fastify";

import { cardapioRoutes } from "./cardapio/cardapio.routes";

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