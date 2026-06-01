export interface MenuClient {
  getMenuItemsTotalPrice(menuItemsIds: string[]): Promise<number>;
}

export class MenuItemClient implements MenuClient {
  async getMenuItemsTotalPrice(menuItemsIds: string[]): Promise<number> {
    let totalPrice = 0;

    for (const menuItemId of menuItemsIds) {
      const response = await fetch(
        `http://app-cardapio:3001/menu-items/${menuItemId}`,
      );

      if (!response.ok) {
        throw new Error("Pedido inválido");
      }

      const menuItem = await response.json();

      totalPrice += menuItem.price;
    }

    return totalPrice;
  }
}
