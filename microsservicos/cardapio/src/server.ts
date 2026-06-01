import "dotenv/config";
import Fastify from "fastify";
import { menuItemsRoutes } from "./routes/menuItem";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.register(menuItemsRoutes);

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) ?? 3001,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
