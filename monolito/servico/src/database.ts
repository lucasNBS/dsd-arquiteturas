import type { MenuItem } from "./models/menuItem";
import type { Order } from "./models/order";
import type { Payment } from "./models/payment";
import type { Notification } from "./models/notification";

export const db = {
  menuItems: [] as MenuItem[],
  orders: [] as Order[],
  payments: [] as Payment[],
  notifications: [] as Notification[],
};
