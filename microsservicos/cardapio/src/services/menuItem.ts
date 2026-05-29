import {
  CreateMenuItemDTO,
  MenuItemsRepository,
  UpdateMenuItemDTO,
} from "../repositories/menuItem";

export class MenuItemsService {
  constructor(private menuItemsRepository: MenuItemsRepository) {}

  async create(data: CreateMenuItemDTO) {
    return await this.menuItemsRepository.create(data);
  }

  async list() {
    return await this.menuItemsRepository.findAll();
  }

  async get(id: string) {
    return await this.menuItemsRepository.findById(id);
  }

  async update(id: string, data: UpdateMenuItemDTO) {
    const item = await this.menuItemsRepository.findById(id);

    if (!item) {
      return null;
    }

    Object.assign(item, data, {
      updatedAt: new Date(),
    });

    await this.menuItemsRepository.save(item);

    return item;
  }

  async delete(id: string) {
    const item = await this.menuItemsRepository.findById(id);

    if (!item) {
      return false;
    }

    await this.menuItemsRepository.delete(id);

    return true;
  }
}
