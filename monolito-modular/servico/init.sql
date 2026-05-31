CREATE SCHEMA IF NOT EXISTS pedido;
CREATE SCHEMA IF NOT EXISTS pagamento;
CREATE SCHEMA IF NOT EXISTS cardapio;
CREATE SCHEMA IF NOT EXISTS notificacao;

CREATE TABLE IF NOT EXISTS cardapio.menu_items (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido.orders (
  id UUID PRIMARY KEY,
  table_number INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido.order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  menu_item_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_order
    FOREIGN KEY (order_id)
    REFERENCES pedido.orders(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_menu_item
    FOREIGN KEY (menu_item_id)
    REFERENCES cardapio.menu_items(id)
);

CREATE TABLE IF NOT EXISTS pagamento.payments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS notificacao.notifications (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    payment_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL
);