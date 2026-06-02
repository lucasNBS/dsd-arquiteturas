import {
  CardapioRepositoryContract,
  CreateMenuItemDTO,
  UpdateMenuItemDTO,
} from "./cardapio.repository";

export class CardapioService {
  constructor(
    private cardapioRepository: CardapioRepositoryContract
  ) {}

  async create(data: CreateMenuItemDTO) {
    return await this.cardapioRepository.create(data);
  }

  async list() {
    return await this.cardapioRepository.findAll();
  }

  async get(id: string) {
    return await this.cardapioRepository.findById(id);
  }

  async update(id: string, data: UpdateMenuItemDTO) {
    const item = await this.cardapioRepository.findById(id);

    if (!item) {
      return null;
    }

    Object.assign(item, data, {
      updatedAt: new Date(),
    });

    await this.cardapioRepository.save(item);

    return item;
  }

  async delete(id: string) {
    const item = await this.cardapioRepository.findById(id);

    if (!item) {
      return false;
    }

    await this.cardapioRepository.delete(id);

    return true;
  }
}