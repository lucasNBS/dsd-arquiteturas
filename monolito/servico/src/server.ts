import "dotenv/config";
import Fastify from "fastify";
import { routes } from "./routes";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
    arquitetura: "monolito",
    uptime: process.uptime(),
  };
});

app.register(routes);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;

    await app.listen({ port, host: "0.0.0.0" });

    console.log(`Monolito rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
