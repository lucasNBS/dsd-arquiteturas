import "dotenv/config";
import Fastify from "fastify";
import { paymentRoutes } from "./routes/payment";
import { rabbitMQ } from "./lib/rabbitmq";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(paymentRoutes);

const start = async () => {
  try {
    await rabbitMQ.connect();

    await app.listen({
      port: Number(process.env.PORT) ?? 3002,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3002");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
