import "dotenv/config";
import Fastify from "fastify";
import { rabbitMQ } from "./lib/rabbitmq";
import { notificationRoutes } from "./routes/notification";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(notificationRoutes);

const start = async () => {
  try {
    await rabbitMQ.connect();
    await rabbitMQ.startConsumers();

    await app.listen({
      port: Number(process.env.PORT) ?? 3003,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3003");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
