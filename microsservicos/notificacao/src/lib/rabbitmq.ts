import amqp from "amqplib";
import { PrismaNotificationsRepository } from "../repositories/notification";
import { NotificationsService } from "../services/notification";

const MAX_RETRIES = 3;

interface MessageQueue {
  connect(): Promise<void>;
  getChannel(): amqp.Channel;
  startConsumers(): Promise<void>;
}

const notificationRepository = new PrismaNotificationsRepository();
const notificationService = new NotificationsService(notificationRepository);

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

  async startConsumers() {
    const channel = this.getChannel();
    await channel.prefetch(5);

    await channel.assertExchange("app.events", "topic", {
      durable: true,
    });

    const queue = await channel.assertQueue("notificacao.pagamento", {
      durable: true,
    });

    await channel.assertQueue("notificacao.dlq", {
      durable: true,
    });

    await channel.bindQueue(queue.queue, "app.events", "pagamento.aprovado");

    channel.consume(
      queue.queue,
      async (msg) => {
        if (!msg) return;

        try {
          const data = JSON.parse(msg.content.toString());

          const exists = await notificationService.findByPaymentId(data.id);

          if (exists) {
            channel.ack(msg);
            return;
          }

          await notificationService.create({
            orderId: data.orderId,
            paymentId: data.id,
          });

          channel.ack(msg);
        } catch (err) {
          this.retry(channel, msg);
        }
      },
      {
        noAck: false,
      },
    );
  }

  private retry(channel: amqp.Channel, msg: amqp.ConsumeMessage): void {
    const retryCount = Number(msg.properties.headers?.["x-retry-count"] ?? 0);

    console.log("retry", retryCount);

    if (retryCount >= MAX_RETRIES) {
      channel.sendToQueue("notificacao.dlq", msg.content, {
        persistent: true,
        headers: {
          ...msg.properties.headers,
          "x-retry-count": retryCount,
        },
      });

      channel.ack(msg);

      return;
    }

    channel.sendToQueue("notificacao.pagamento", msg.content, {
      persistent: true,
      headers: {
        ...msg.properties.headers,
        "x-retry-count": retryCount + 1,
      },
    });

    channel.ack(msg);
  }
}

export const rabbitMQ = new RabbitMQ();
