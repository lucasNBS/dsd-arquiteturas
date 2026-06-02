# Sistema de Pedidos de Lanchonete - Monólito Modular

## Sobre o Projeto

Este projeto implementa um sistema de pedidos para uma lanchonete utilizando a arquitetura **Monólito Modular**.

O sistema foi desenvolvido como parte da disciplina de Sistemas Distribuídos com o objetivo de comparar diferentes estilos arquiteturais: Monólito, Monólito Modular e Microsserviços.

Nesta versão, a aplicação é executada como um único processo e um único deploy, porém possui fronteiras explícitas entre seus módulos, reduzindo o acoplamento e facilitando futuras evoluções para uma arquitetura baseada em microsserviços.

---

## Arquitetura

A aplicação é organizada em módulos independentes:

* Pedidos
* Pagamento
* Cardápio
* Notificação

Cada módulo possui:

* Rotas
* Serviços
* Repositórios
* Contratos públicos (Facades)

Os módulos se comunicam exclusivamente através de interfaces públicas, sem acesso direto aos repositórios ou tabelas de outros módulos.

### Estrutura do Projeto

```text
src/
├── modules/
│   ├── pedidos/
│   ├── pagamento/
│   ├── cardapio/
│   └── notificacao/
│
├── container/
│   └── index.ts
│
├── database/
│
└── server.ts
```

---

## Regras de Negócio

### Fluxo Principal

1. Cliente cria um pedido.
2. O pedido é criado com status `PENDING`.
3. O pagamento é processado.
4. Após confirmação do pagamento:

   * O pagamento recebe status `PAID`.
   * O pedido recebe status `PREPARING`.
   * Uma notificação é enviada para a cozinha.
5. A cozinha pode concluir o pedido.
6. O pedido recebe status `DONE`.

---

## Comunicação Entre Módulos

### Pedido → Pagamento

```text
OrdersService
      ↓
PaymentFacade
      ↓
PaymentService
```

### Pagamento → Notificação

```text
PaymentService
      ↓
NotificationFacade
      ↓
NotificationsService
```

### Notificação → Pedido

```text
NotificationsService
      ↓
OrderFacade
      ↓
OrdersService
```

Nenhum módulo acessa diretamente o repositório de outro módulo.

---

## Banco de Dados

A aplicação utiliza PostgreSQL.

Embora seja um único banco de dados, cada módulo possui seu próprio schema lógico:

```sql
pedidos.*
pagamento.*
cardapio.*
notificacao.*
```

Essa separação reduz o acoplamento e facilita uma futura migração para microsserviços.

---

## Tecnologias Utilizadas

* Node.js
* TypeScript
* Fastify
* PostgreSQL
* Zod
* Docker
* Docker Compose

---

## Como Executar

### Clonar o Repositório

```bash
git clone <repositorio>
cd monolito-modular
```

### Subir os Containers

```bash
docker compose up --build
```

### Verificar Saúde da Aplicação

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## Endpoints

### Cardápio

#### Listar itens

```http
GET /cardapio
```

#### Criar item

```http
POST /cardapio
```


### Pedidos

#### Criar pedido

```http
POST /orders
```

Exemplo:


#### Listar pedidos

```http
GET /orders
```

---

### Pagamentos

#### Criar pagamento

```http
POST /payments
```

#### Confirmar pagamento

```http
PATCH /payments/{id}/pay
```


#### Concluir pedido

```http
PATCH /notifications/{orderId}/done
```
