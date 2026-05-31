CREATE SCHEMA IF NOT EXISTS pedidos;

CREATE SCHEMA IF NOT EXISTS cardapio;

CREATE SCHEMA IF NOT EXISTS pagamento;

CREATE TABLE IF NOT EXISTS pagamento.payments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE SCHEMA IF NOT EXISTS notificacao;

CREATE TABLE IF NOT EXISTS notificacao.notifications (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    payment_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL
);