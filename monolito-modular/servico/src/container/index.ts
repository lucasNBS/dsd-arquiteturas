import { PostgresNotificationsRepository } from "../modules/notificacao/repositories/notification";
import { NotificationsService } from "../modules/notificacao/services/notification";

import { PostgresPaymentRepository } from "../modules/pagamento/repositories/payment";
import { PaymentService } from "../modules/pagamento/services/payment";

import { CardapioRepository } from "../modules/cardapio/cardapio.repository";
import { CardapioService } from "../modules/cardapio/cardapio.service";

import { PedidoRepository } from "../modules/pedido/pedido.repository";
import { PedidoService } from "../modules/pedido/pedido.service";


const cardapioRepository =
  new CardapioRepository();

const cardapioService =
  new CardapioService(
    cardapioRepository
  );

const pedidoRepository =
  new PedidoRepository();

const pedidoService =
  new PedidoService(
    pedidoRepository
  );

const notificationsRepository =
  new PostgresNotificationsRepository();

const notificationsService =
  new NotificationsService(
    notificationsRepository,
    pedidoService
  );

const paymentsRepository =
  new PostgresPaymentRepository();

const paymentService =
  new PaymentService(
    paymentsRepository,
    notificationsService,
    pedidoService
  );
  
export {
  paymentService,
  notificationsService,
  cardapioService,
  pedidoService,
};