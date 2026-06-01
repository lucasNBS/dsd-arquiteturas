import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://lanchonete:lanchonete@localhost:5436/lanchonete";

export const pool = new Pool({ connectionString: DATABASE_URL });

export function query<T extends Record<string, any> = any>(
  text: string,
  params?: any[],
) {
  return pool.query<T>(text, params);
}

export async function initDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id          UUID    PRIMARY KEY,
      name        TEXT    NOT NULL,
      description TEXT,
      price       NUMERIC NOT NULL,
      available   BOOLEAN NOT NULL DEFAULT TRUE,
      created_at  TIMESTAMPTZ NOT NULL,
      updated_at  TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id          UUID    PRIMARY KEY,
      table_num   INTEGER NOT NULL,
      amount      NUMERIC NOT NULL,
      status      TEXT    NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id           SERIAL  PRIMARY KEY,
      order_id     UUID    NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
      menu_item_id UUID    NOT NULL,
      name         TEXT    NOT NULL,
      quantity     INTEGER NOT NULL,
      price        NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id          UUID    PRIMARY KEY,
      order_id    UUID    NOT NULL,
      amount      NUMERIC NOT NULL,
      status      TEXT    NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id          UUID    PRIMARY KEY,
      order_id    UUID    NOT NULL,
      payment_id  UUID    NOT NULL,
      target      TEXT    NOT NULL,
      message     TEXT    NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL
    );
  `);
}
