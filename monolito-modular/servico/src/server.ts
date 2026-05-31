import "dotenv/config";
import Fastify from "fastify";
import { paymentRoutes } from "./modules/pagamento/routes/payment";


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
    await app.listen({
      port: Number(process.env.PORT) ?? 8080,
      host: "0.0.0.0",
    });

    console.log("Server running on port" + process.env.PORT);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
