import "dotenv/config";
import Fastify from "fastify";
import { ordersRoutes } from "./routes/order";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(ordersRoutes);

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) ?? 3333,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
