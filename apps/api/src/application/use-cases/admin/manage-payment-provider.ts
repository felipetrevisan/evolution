import type {
  AdminConfigRepository,
  PaymentProviderConfig,
} from "../../repositories/admin-config-repository";

export function getPaymentProvider(repository: AdminConfigRepository) {
  return repository.getPaymentProvider();
}

export function savePaymentProvider(
  config: PaymentProviderConfig,
  repository: AdminConfigRepository,
) {
  return repository.savePaymentProvider(config);
}
