# Sistema de Pedidos de Lanchonete - Microsserviços

## Como executar

```
git clone https://github.com/lucasNBS/dsd-arquiteturas.git
cd dsd-arquiteturas/microsservicos/
docker compose up --build
```

## API

#### Cardapio

```http
GET http://localhost:3001/health - Health check

GET http://localhost:3001/menu-items - Visualizar itens no menu

GET http://localhost:3001/menu-items/{id} - Visualizar item no menu

POST http://localhost:3001/menu-items - Criar item no menu
{
  "name": "Menu item 1",
  "description": "teste teste",
  "price": 99.99
}

PATCH http://localhost:3001/menu-items/{id} - Editar item no menu
```

#### Pedidos

```http
GET http://localhost:3000/health - Health check

GET http://localhost:3000/orders - Visualizar pedidos

POST http://localhost:3000/orders - Criar pedido
{
  "table": 100,
  "items": [
    UUID de um Menu Item
  ]
}

PATCH http://localhost:3000/orders/{id} - Editar pedido
```

#### Pagamento

```http
GET http://localhost:3002/health - Health check

GET http://localhost:3002/payments - Visualizar pagamentos

POST http://localhost:3002/payments - Criar pagamento (PENDENTE)
{
  "amount": 200.75,
  "orderId": UUID de um Pedido
}

PATCH http://localhost:3002/payments/{id}/pay - Pagar pagamento
```

#### Notificação

```http
GET http://localhost:3003/health - Health check

GET http://localhost:3003/notification - Visualizar notificações
```

## Fluxo de Execução

- Criar itens no menu
- Criar pedido com os itens disponíveis no menu
- Pagar pagamento referente ao pedido

## Experimentos

#### Derrubar o serviço de notificação e fazer um pedido. O sistema se comporta bem? O pagamento falha junto?

Por conta da arquitetura distribuída, que faz os serviços operarem de maneira independente, os demais serviços funcionam normalmente.

Pela forma de implementação, o pagamento é realizado, e o registro desse evento é colocado na fila, de forma que, quando o serviço de notificação volte ao ar, a notificação é enviada normalmente.

#### Pelo menos uma estratégia de resiliencia implementada: retry, circuit breaker ou timeout explícito.

Implementado sistema de retry na fila, de forma que, caso haja um erro no processo, a mensagem seja recolocada na fila para ser processada posteriormente até atingir um limite de 3 tentativas. A partir deste ponto, a mensagem é colocada em uma dead letter queue.

#### Documentar: como faria rollback apenas do serviço de pagamento sem afetar os outros?

Por conta da arquitetura distribuída, os demais serviços funcionam de forma independente uns dos outros. Dessa forma, seria possível subir uma nova instância do serviço de pagamento enquanto os demais serviços consomem da instância "antiga" e, uma vez estando no ar, pode apontar o roteamento para a nova versão do serviço.
