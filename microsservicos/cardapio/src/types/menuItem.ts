export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}
