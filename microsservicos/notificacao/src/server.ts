import "dotenv/config";
import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) ?? 8800,
      host: "0.0.0.0",
    });

    console.log("Server running on port 8800");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
