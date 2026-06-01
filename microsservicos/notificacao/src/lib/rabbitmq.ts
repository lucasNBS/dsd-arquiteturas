import amqp from "amqplib";
import { PrismaNotificationsRepository } from "../repositories/notification";
import { NotificationsService } from "../services/notification";

interface MessageQueue {
  connect(): Promise<void>;
  getChannel(): amqp.Channel;
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

    await channel.assertExchange("app.events", "topic", {
      durable: true,
    });

    const queue = await channel.assertQueue("notificacao.pagamento", {
      durable: true,
    });

    await channel.bindQueue(queue.queue, "app.events", "pagamento.aprovado");

    channel.consume(queue.queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());

      notificationService.create({
        orderId: data.orderId,
        paymentId: data.id,
      });

      channel.ack(msg);
    });
  }
}

export const rabbitMQ = new RabbitMQ();
