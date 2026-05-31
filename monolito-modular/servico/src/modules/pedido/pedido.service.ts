import {
  CreateOrderDTO,
  PedidoRepository,
} from "./pedido.repository";

export class PedidoService {
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
}