import { PostgresNotificationsRepository } from "../modules/notificacao/repositories/notification";
import { PaymentService } from "../modules/pagamento/services/payment";
import { NotificationsService } from "../modules/notificacao/services/notification";
import { PostgresPaymentRepository } from "../modules/pagamento/repositories/payment";

const notificationsRepository =
  new PostgresNotificationsRepository();

const notificationsService =
  new NotificationsService(
    notificationsRepository
  );

const paymentsRepository =
  new PostgresPaymentRepository();

const paymentService =
  new PaymentService(
    paymentsRepository,
    notificationsService
  );

export {
  paymentService,
  notificationsService
};