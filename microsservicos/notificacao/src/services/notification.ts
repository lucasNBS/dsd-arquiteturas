import {
  CreateNotificationDTO,
  NotificationsRepository,
} from "../repositories/notification";

export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async create(data: CreateNotificationDTO) {
    return await this.notificationsRepository.create(data);
  }

  async list() {
    return await this.notificationsRepository.findAll();
  }
}
