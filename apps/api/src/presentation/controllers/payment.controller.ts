import { getCheckout } from "../../application/use-cases/payment/get-checkout";
import { processHotmartWebhook } from "../../application/use-cases/payment/process-hotmart-webhook";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";

export async function checkoutController(currentUser: CurrentUser) {
  const repo = repositories();
  const profile = await repo.users.get(currentUser.uid);

  return getCheckout(profile, repo.adminConfig);
}

export async function hotmartWebhookController(
  headers: Record<string, string | undefined>,
  body: unknown,
) {
  const repo = repositories();

  return processHotmartWebhook(body ? { headers, body } : { headers, body: {} }, {
    adminConfig: repo.adminConfig,
    users: repo.users,
  });
}
