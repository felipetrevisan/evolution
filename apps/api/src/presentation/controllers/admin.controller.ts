import { type InvestigationQuestion, VECTOR_KEYS, type VectorKey } from "@evolution/domain";
import {
  getAdminInvestigationQuestions,
  getAdminOperationalQuestions,
  saveAdminInvestigationQuestions,
  saveAdminOperationalQuestions,
} from "../../application/use-cases/admin/manage-assessment-config";
import {
  getPaymentProvider,
  savePaymentProvider,
} from "../../application/use-cases/admin/manage-payment-provider";
import {
  deleteSubscriptionPlan,
  listSubscriptionPlans,
  saveSubscriptionPlan,
} from "../../application/use-cases/admin/manage-subscription-plans";
import {
  getAdminTriageQuestions,
  saveAdminTriageQuestions,
} from "../../application/use-cases/admin/manage-triage-config";
import { listAdminUsers, updateAdminUser } from "../../application/use-cases/admin/manage-users";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import { ApiError } from "../../shared/errors/api-error";
import type {
  AdminInvestigationQuestionsBodyDto,
  AdminOperationalQuestionsBodyDto,
  AdminTriageQuestionsBodyDto,
  PaymentProviderBodyDto,
  SubscriptionPlanBodyDto,
  UpdateUserAdminBodyDto,
} from "../dtos/admin.dto";

export async function adminUsersController() {
  return listAdminUsers(repositories().users);
}

export function adminSessionController(currentUser: CurrentUser) {
  return {
    isAdmin: true,
    uid: currentUser.uid,
    role: "admin" as const,
  };
}

export async function adminUpdateUserController(uid: string, body: UpdateUserAdminBodyDto) {
  return updateAdminUser(uid, body, repositories().users);
}

export async function adminSubscriptionPlansController() {
  return listSubscriptionPlans(repositories().adminConfig);
}

export async function adminSaveSubscriptionPlanController(body: SubscriptionPlanBodyDto) {
  return saveSubscriptionPlan(body, repositories().adminConfig);
}

export async function adminDeleteSubscriptionPlanController(planId: string) {
  return deleteSubscriptionPlan(planId, repositories().adminConfig);
}

export async function adminPaymentProviderController() {
  return getPaymentProvider(repositories().adminConfig);
}

export async function adminSavePaymentProviderController(body: PaymentProviderBodyDto) {
  return savePaymentProvider(body, repositories().adminConfig);
}

export async function adminTriageQuestionsController() {
  return {
    questions: await getAdminTriageQuestions(repositories().adminConfig),
  };
}

export async function adminSaveTriageQuestionsController(body: AdminTriageQuestionsBodyDto) {
  return {
    questions: await saveAdminTriageQuestions(body.questions, repositories().adminConfig),
  };
}

export async function adminInvestigationQuestionsController(priorityVector: VectorKey) {
  if (!VECTOR_KEYS.includes(priorityVector)) {
    throw new ApiError("INVALID_VECTOR", "Vetor inválido.", 422);
  }

  return {
    questions: await getAdminInvestigationQuestions(priorityVector, repositories().adminConfig),
  };
}

export async function adminSaveInvestigationQuestionsController(
  body: AdminInvestigationQuestionsBodyDto,
) {
  const questionsByVector = body.questionsByVector as Record<VectorKey, InvestigationQuestion[]>;
  const missingVector = VECTOR_KEYS.find((vector) => !questionsByVector[vector]);

  if (missingVector) {
    throw new ApiError("INVALID_INVESTIGATION_CONFIG", `Vetor ${missingVector} ausente.`, 422);
  }

  return {
    questionsByVector: await saveAdminInvestigationQuestions(
      questionsByVector,
      repositories().adminConfig,
    ),
  };
}

export async function adminOperationalQuestionsController() {
  return {
    questions: await getAdminOperationalQuestions(repositories().adminConfig),
  };
}

export async function adminSaveOperationalQuestionsController(
  body: AdminOperationalQuestionsBodyDto,
) {
  return {
    questions: await saveAdminOperationalQuestions(body.questions, repositories().adminConfig),
  };
}
