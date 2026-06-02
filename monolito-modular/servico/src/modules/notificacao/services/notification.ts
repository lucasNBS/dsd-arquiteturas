import {
  CreateNotificationDTO,
  NotificationsRepository,
} from "../repositories/notification";
import { NotificationFacade }
from "../contracts/facade";
import { OrderFacade } from "../../pedido/contracts/facade";

export class NotificationsService
  implements NotificationFacade {

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private orderFacade: OrderFacade
  ) {}

  async create(data: CreateNotificationDTO) {
    return await this.notificationsRepository.create(data);
  }

  async notifyOrderPaid(orderId: string, paymentId: string): Promise<void> {
    await this.create({orderId,paymentId});
  }

  async completeOrder(orderId: string): Promise<void> {

    await this.orderFacade.markAsDone(orderId);
  }
}
