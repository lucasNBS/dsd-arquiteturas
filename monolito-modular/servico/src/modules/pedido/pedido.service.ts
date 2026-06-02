import { OrderFacade } from "./contracts/facade";
import {
  CreateOrderDTO,
  PedidoRepository,
} from "./pedido.repository";

export class PedidoService implements OrderFacade {
  constructor(
    private readonly pedidoRepository: PedidoRepository,
  ) {}

  async create(data: CreateOrderDTO) {
    return this.pedidoRepository.create(data);
  }

  async list() {
    return this.pedidoRepository.findAll();
  }

  async get(id: string) {
    return this.pedidoRepository.findById(id);
  }

  async cancel(id: string) {
    const order = await this.pedidoRepository.findById(id);

    if (!order) {
      return null;
    }

    order.status = "cancelled";

    await this.pedidoRepository.save(order);

    return order;
  }

  async markAsPreparing(orderId: string): Promise<void> {

    const order = await this.pedidoRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    order.status = "preparing";
    order.updated_at = new Date();

    await this.pedidoRepository.save(order);
  }

  async markAsDone(orderId: string): Promise<void> {

    const order = await this.pedidoRepository.findById(orderId);

    if (!order) {
      throw new Error(
        "Pedido não encontrado"
      );
    }

    order.status = "done";

    await this.pedidoRepository.save(order);
  }
}