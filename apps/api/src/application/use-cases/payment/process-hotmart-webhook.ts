import { createId } from "../../../shared/validation/id";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserRepository } from "../../repositories/user-repository";
import { annualExpirationFromNow } from "../subscription/subscription-access";

type HotmartWebhookInput = {
  headers: Record<string, string | undefined>;
  body: unknown;
};

type PaymentAction = "activate" | "past_due" | "cancel" | "ignore";

export async function processHotmartWebhook(
  input: HotmartWebhookInput,
  repositories: {
    adminConfig: AdminConfigRepository;
    users: UserRepository;
  },
) {
  const provider = await repositories.adminConfig.getPaymentProvider();
  const hottok = input.headers["x-hotmart-hottok"] ?? input.headers["X-HOTMART-HOTTOK"];

  if (!provider?.active) {
    return saveEvent(input.body, repositories.adminConfig, {
      action: "ignore",
      email: null,
      event: "provider_inactive",
      status: "ignored",
    });
  }

  if (provider.hottok && provider.hottok !== hottok) {
    return saveEvent(input.body, repositories.adminConfig, {
      action: "ignore",
      email: null,
      event: "invalid_hottok",
      status: "ignored",
    });
  }

  const event = parseHotmartEvent(input.body);
  const user = event.email ? await repositories.users.getByEmail(event.email) : null;

  if (!user) {
    return saveEvent(input.body, repositories.adminConfig, {
      action: event.action,
      email: event.email,
      event: event.event,
      status: "unmatched",
    });
  }

  if (event.action !== "ignore") {
    await repositories.users.upsert(user.uid, {
      subscription: {
        currentPeriodEnd:
          event.action === "activate"
            ? annualExpirationFromNow()
            : (user.subscription?.currentPeriodEnd ?? new Date().toISOString()),
        planId: event.planId ?? user.subscription?.planId ?? "hotmart",
        provider: "hotmart",
        status: subscriptionStatusForAction(event.action),
        updatedAt: new Date().toISOString(),
        ...(event.subscriptionId ? { providerSubscriptionId: event.subscriptionId } : {}),
        ...(event.transactionId ? { providerTransactionId: event.transactionId } : {}),
      },
    });
  }

  return saveEvent(input.body, repositories.adminConfig, {
    action: event.action,
    email: event.email,
    event: event.event,
    status: event.action === "ignore" ? "ignored" : "processed",
  });
}

function parseHotmartEvent(body: unknown) {
  const payload = toRecord(body);
  const data = toRecord(payload.data);
  const event = stringValue(payload.event) ?? "UNKNOWN";
  const purchase = toRecord(data.purchase);
  const subscription = toRecord(data.subscription);
  const buyer = toRecord(data.buyer);
  const subscriber = toRecord(data.subscriber) ?? toRecord(subscription.subscriber);
  const plan = toRecord(subscription.plan);

  return {
    action: resolveAction(event, stringValue(purchase.status), stringValue(subscription.status)),
    email: normalizeEmail(stringValue(buyer.email) ?? stringValue(subscriber.email)),
    event,
    planId:
      stringValue(plan.id) ?? stringValue(plan.name) ?? stringValue(toRecord(data.product).ucode),
    subscriptionId:
      stringValue(subscription.id) ?? stringValue(toRecord(subscription.subscriber).code),
    transactionId: stringValue(purchase.transaction),
  };
}

function resolveAction(
  event: string,
  purchaseStatus?: string,
  subscriptionStatus?: string,
): PaymentAction {
  const values = [event, purchaseStatus, subscriptionStatus]
    .filter(Boolean)
    .map((value) => value?.toUpperCase());

  if (
    values.some((value) =>
      ["PURCHASE_APPROVED", "APPROVED", "PURCHASE_COMPLETE", "COMPLETE", "ACTIVE"].includes(
        value ?? "",
      ),
    )
  ) {
    return "activate";
  }

  if (
    values.some(
      (value) => value === "PURCHASE_DELAYED" || value === "OVERDUE" || value === "DELAYED",
    )
  ) {
    return "past_due";
  }

  if (
    values.some((value) =>
      [
        "PURCHASE_CANCELED",
        "PURCHASE_REFUNDED",
        "PURCHASE_CHARGEBACK",
        "PURCHASE_EXPIRED",
        "CANCELLED",
        "CANCELED",
        "REFUNDED",
        "CHARGEBACK",
        "EXPIRED",
        "CANCELLED_BY_CUSTOMER",
        "CANCELLED_BY_SELLER",
        "CANCELLED_BY_ADMIN",
      ].includes(value ?? ""),
    )
  ) {
    return "cancel";
  }

  return "ignore";
}

function saveEvent(
  payload: unknown,
  repository: AdminConfigRepository,
  input: {
    action: PaymentAction;
    email: string | null;
    event: string;
    status: "processed" | "ignored" | "unmatched";
  },
) {
  return repository.savePaymentEvent({
    id: createId("payment_event"),
    provider: "hotmart",
    receivedAt: new Date().toISOString(),
    payload,
    ...input,
  });
}

function subscriptionStatusForAction(action: PaymentAction) {
  if (action === "activate") {
    return "active";
  }

  if (action === "past_due") {
    return "past_due";
  }

  return "canceled";
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function normalizeEmail(value?: string) {
  return value?.trim().toLowerCase() || null;
}
