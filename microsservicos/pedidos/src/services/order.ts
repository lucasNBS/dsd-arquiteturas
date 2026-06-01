import { MenuClient } from "../client/menuItem";
import { Payment } from "../client/payment";
import { CreateOrderDTO, OrdersRepository } from "../repositories/order";

export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly menuClient: MenuClient,
    private readonly paymentClient: Payment,
  ) {}

  async create(data: CreateOrderDTO) {
    try {
      const totalPrice = await this.menuClient.getMenuItemsTotalPrice(
        data.items,
      );

      const order = await this.ordersRepository.create(data);
      await this.paymentClient.createPayment(totalPrice, order.id);

      return order;
    } catch (err) {
      throw new Error("Pedido inválido");
    }
  }

  async list() {
    return await this.ordersRepository.findAll();
  }

  async cancel(id: string) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      return null;
    }

    order.status = "CANCELLED";

    await this.ordersRepository.save(order);

    return order;
  }
}
