import amqp from "amqplib";

interface MessageQueue {
  connect(): Promise<void>;
  getChannel(): amqp.Channel;
  publishPagamentoAprovado(data: unknown): Promise<void>;
}

export class RabbitMQ implements MessageQueue {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
    this.channel = await this.connection.createChannel();
  }

  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error("RabbitMQ não conectado");
    }

    return this.channel;
  }

  async publishPagamentoAprovado(data: unknown): Promise<void> {
    const channel = this.getChannel();

    await channel.assertExchange("app.events", "topic", {
      durable: true,
    });

    channel.publish(
      "app.events",
      "pagamento.aprovado",
      Buffer.from(JSON.stringify(data)),
      { persistent: true },
    );
  }
}

export const rabbitMQ = new RabbitMQ();
