import { listNotifications } from "../models/notification";

export async function index() {
  return listNotifications();
}
