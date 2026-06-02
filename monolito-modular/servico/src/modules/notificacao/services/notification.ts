import {
  CreateNotificationDTO,
  NotificationsRepository,
} from "../repositories/notification";
import { NotificationFacade }
from "../contracts/facade";

export class NotificationsService
  implements NotificationFacade {

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async create(data: CreateNotificationDTO) {
    return await this.notificationsRepository.create(data);
  }

  async notifyOrderPaid(orderId: string, paymentId: string): Promise<void> {
    await this.create({orderId,paymentId});
  }
}
