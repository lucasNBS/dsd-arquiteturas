import { CreateOrderDTO, OrdersRepository } from "../repositories/order";

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(data: CreateOrderDTO) {
    return await this.ordersRepository.create(data);
  }

  async list() {
    return await this.ordersRepository.findAll();
  }

  async cancel(id: string) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      return null;
    }

    order.status = "CANCELED";

    await this.ordersRepository.save(order);

    return order;
  }
}
