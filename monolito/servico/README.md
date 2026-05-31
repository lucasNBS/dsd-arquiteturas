# Versão 1 — Monólito (MVC)

Sistema de Pedidos de Lanchonete implementado como **monólito** seguindo o
padrão **MVC**: uma única aplicação, um único processo, uma única porta e um
único banco (em memória). Os quatro domínios — **cardápio**, **pedidos**,
**pagamento** e **notificação** — existem como pastas de Models e Controllers,
mas **sem fronteiras rígidas**: os controllers chamam os models de outros
domínios **diretamente**. O acoplamento é natural e proposital — o objetivo do
trabalho é sentir o peso de cada arquitetura.

> Mesma stack (Fastify + TypeScript) e mesmo domínio das versões *Monólito
> Modular* e *Microsserviços* (na pasta raiz `microsservicos/`), para que a
> comparação seja justa. Esta versão usa os microsserviços como base, porém
> colapsados em uma única aplicação MVC com acoplamento direto.

---

## Stack

- **Node.js** + **TypeScript**
- **Fastify** (HTTP)
- **tsx** (execução em dev) / **tsc** (build)
- Banco **único em memória** (`src/database.ts`)

---

## Estrutura (MVC)

```
servico/
├── src/
│   ├── server.ts          # App Fastify único, /health
│   ├── routes.ts          # Roteamento: URLs -> controllers
│   ├── database.ts        # BANCO ÚNICO em memória (todas as "tabelas")
│   ├── models/            # M — dados e acesso ao banco
│   │   ├── menuItem.ts
│   │   ├── order.ts
│   │   ├── payment.ts
│   │   └── notification.ts
│   └── controllers/       # C — recebem a requisição, respondem JSON (a View)
│       ├── menuItemController.ts
│       ├── orderController.ts
│       ├── paymentController.ts
│       └── notificationController.ts
└── ...
```

- **Model (M):** funções em `models/` que leem e escrevem direto no banco único
  (`database.ts`).
- **Controller (C):** funções em `controllers/` que recebem a requisição HTTP,
  validam a entrada e chamam os models.
- **View:** as respostas em **JSON** devolvidas pelos controllers.

### Onde mora o acoplamento

Não há interfaces nem injeção de dependência: os models e controllers **importam
e chamam diretamente** os de outros domínios. Existem dois acoplamentos diretos:

```
Pedidos    -> Cardápio       (ao criar, valida o item e pega o preço oficial)
Pagamento  -> Pedidos        (lê o pedido, marca como pago, libera p/ cozinha)
Pagamento  -> Notificação    (avisa a cozinha)
```

- **Pedidos → Cardápio** ([`src/models/order.ts`](src/models/order.ts)): no
  `POST /orders` o cliente envia apenas `menuItemId` + `quantity`. O model de
  Pedidos chama `findMenuItemById` do Cardápio para **validar a existência e a
  disponibilidade** do item e usar o **preço oficial** do cardápio (o cliente
  não envia preço). Item inexistente ou indisponível → `400`.
- **Pagamento → Pedidos / Notificação**
  ([`src/controllers/paymentController.ts`](src/controllers/paymentController.ts)):
  ver a regra de negócio crítica abaixo.

### Regra de negócio crítica

> Um pedido só vai para a cozinha **após** a confirmação do pagamento.

No monólito isso é uma cascata de chamadas diretas dentro de `pay()`:

```
pagamento aprovado
  -> markOrderAsPaid(orderId)      // pedido: PENDING -> PAID
  -> moveOrderToKitchen(orderId)   // pedido: PAID -> IN_KITCHEN
  -> createNotification(...)       // notifica a COZINHA
```

Ciclo de vida do pedido: `PENDING → PAID → IN_KITCHEN` (ou `CANCELED`).

---

## Como rodar

Pré-requisitos: **Node.js 20+** e `npm`.

```bash
cd monolito/servico

npm install        # instala dependências

npm run dev        # desenvolvimento (hot reload)
# ou
npm run build && npm start   # produção
```

A aplicação sobe em **http://localhost:3000** (configurável via `PORT`).

Para conferir se subiu, rode o request **`### Health check`** no arquivo
[`requests.http`](requests.http). A resposta deve ser:

```json
{ "status": "ok", "arquitetura": "monolito", "uptime": ... }
```

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste o que precisar (o `.env` é carregado
automaticamente na inicialização):

```bash
cp .env.example .env
```

| Variável             | Default | Para que serve                                              |
|----------------------|---------|------------------------------------------------------------|
| `PORT`               | `3000`  | Porta do servidor                                          |
| `PAGAMENTO_LENTO`    | —       | Se `true`, o pagamento bloqueia o event loop (experimento) |
| `PAGAMENTO_SLEEP_MS` | `5000`  | Duração do bloqueio quando `PAGAMENTO_LENTO=true`          |
| `PAGAMENTO_RECUSAR`  | —       | Se `true`, o pagamento mock é **recusado** (testar falha)  |

---

## Endpoints

### Cardápio
| Método | Rota               | Descrição                       |
|--------|--------------------|---------------------------------|
| POST   | `/menu-items`      | Cria item (`name`, `price`, ...)|
| GET    | `/menu-items`      | Lista itens                     |
| GET    | `/menu-items/:id`  | Detalha item                    |
| PATCH  | `/menu-items/:id`  | Atualiza item / disponibilidade |
| DELETE | `/menu-items/:id`  | Remove item                     |

### Pedidos
| Método | Rota                  | Descrição                              |
|--------|-----------------------|----------------------------------------|
| POST   | `/orders`             | Cria pedido (`table`, `items[{menuItemId,quantity}]`) |
| GET    | `/orders`             | Lista pedidos                          |
| GET    | `/orders/:id`         | Detalha pedido                         |
| PATCH  | `/orders/:id/cancel`  | Cancela (bloqueado se já `IN_KITCHEN`) |

### Pagamento
| Método | Rota                  | Descrição                                    |
|--------|-----------------------|----------------------------------------------|
| POST   | `/payments`           | Paga um pedido (`orderId`) e dispara cozinha |
| GET    | `/payments/:orderId`  | Status do pagamento do pedido                |

### Notificação
| Método | Rota              | Descrição                             |
|--------|-------------------|---------------------------------------|
| GET    | `/notifications`  | Lista notificações enviadas à cozinha |

> As notificações são criadas **internamente** pelo controller de Pagamento
> (chamada direta ao model), não por uma rota pública.

---

## Fluxo completo

Para testar, use o arquivo [`requests.http`](requests.http) — abra-o no VS Code
(extensão **REST Client**) ou no JetBrains e clique em **Send Request** em cada
bloco, na ordem. Os ids de item e pedido são capturados automaticamente entre os
requests, então não é preciso copiar e colar nada.

O fluxo segue estes passos:

| # | Passo               | Request                  | Resultado esperado                              |
|---|---------------------|--------------------------|-------------------------------------------------|
| 1 | Cria item no cardápio | `POST /menu-items`     | item criado (ex.: `X-Burger`, R$ 25,50)         |
| 2 | Cria pedido         | `POST /orders`           | `status: PENDING`, `amount` calculado pelo cardápio |
| 3 | Paga o pedido       | `POST /payments`         | `status: PAID` → dispara a cozinha em cascata    |
| 4 | Confere o pedido    | `GET /orders/:id`        | `status: IN_KITCHEN`                             |
| 5 | Confere a cozinha   | `GET /notifications`     | 1 notificação para a `COZINHA`                   |

> No passo 2 envie apenas `menuItemId` + `quantity`; o **nome e o preço vêm do
> cardápio** (acoplamento direto Pedidos → Cardápio).

---

## Experimentos

### Experimento obrigatório — lentidão no módulo de pagamento

Suba o monólito simulando lentidão (sleep bloqueante de 5s no pagamento) —
ative `PAGAMENTO_LENTO=true` no `.env` (ou na linha de comando) e rode:

```bash
PAGAMENTO_LENTO=true PAGAMENTO_SLEEP_MS=5000 npm run dev
```

No arquivo [`requests.http`](requests.http), prepare um pedido (requests
**`### Criar item`** e **`### Criar pedido`**) e então:

1. Dispare **`### Pagar pedido`** (vai ficar ~5 s travado).
2. **Enquanto ele roda**, dispare **`### Health check`** em outra aba/janela.

**Observado:** o `### Health check`, que normalmente responde em milissegundos,
levou **~4,5 s** — ficou preso esperando o pagamento terminar.

**Por quê:** o monólito roda em **um único processo Node, single-thread**. O sleep
é bloqueante (trava o *event loop*), então **todos** os endpoints — cardápio,
pedidos, health — congelam junto. Uma lentidão localizada em um módulo vira uma
lentidão global da aplicação inteira. Esse é o principal ponto de dor do monólito:
não há isolamento de falha/recurso entre os domínios.

### Simular falha no pagamento

Ative `PAGAMENTO_RECUSAR=true` no `.env` (ou na linha de comando) e suba o app:

```bash
PAGAMENTO_RECUSAR=true npm run dev
```

No [`requests.http`](requests.http), crie um pedido e dispare **`### Pagar
pedido`**: o pagamento volta com `status: REFUSED`. Em seguida, confira que o
pedido **não** foi para a cozinha (**`### Detalhar pedido`** continua `PENDING`)
e que **`### Listar notificacoes`** está vazio.

A regra de negócio se mantém: sem pagamento aprovado, não há cozinha.

---

## Pergunta do trabalho — e se o Cardápio precisasse escalar 10x mais que o resto?

No monólito **não dá para escalar só o cardápio**. Como tudo é um único
deploy/processo, a única forma de dar mais capacidade ao cardápio é **replicar a
aplicação inteira** (cardápio + pedidos + pagamento + notificação) atrás de um
load balancer. Consequências:

- **Desperdício de recursos:** sobem-se cópias completas do sistema só para
  atender a demanda de um módulo; pagamento e notificação escalam junto sem
  precisar.
- **Estado compartilhado vira gargalo:** aqui o estado é em memória no processo;
  ao replicar, seria preciso extrair o estado para um banco/cache externo, senão
  cada réplica teria dados diferentes.
- **Acoplamento de implantação:** qualquer mudança no cardápio exige redeploy do
  todo; não há granularidade de escala nem de deploy.

**O que precisaria mudar:** separar o cardápio em um processo/serviço próprio,
com seu próprio armazenamento e contrato de comunicação (HTTP/fila) — ou seja,
caminhar para o *Monólito Modular* (fronteiras explícitas, passo intermediário) e
depois para *Microsserviços* (processo e banco independentes, escala individual).
É exatamente a motivação das Versões 2 e 3.

---

## Checklist da Versão 1 — Monólito

- [x] Única aplicação rodando em uma porta (Fastify na `:3000`).
- [x] Banco único com todas as "tabelas" (`src/database.ts`).
- [x] Fluxo completo funcional: criar pedido → pagar → notificar cozinha.
- [x] Endpoint de health check (`GET /health`).
- [x] Experimento de lentidão no pagamento (sleep 5s) documentado acima.
- [x] Documentado: o que mudaria para o cardápio escalar 10x.
