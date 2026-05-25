import { Elysia } from "elysia";
import { requireActiveUser } from "../../infrastructure/auth/require-active-user";
import { requireAdminUser } from "../../infrastructure/auth/require-admin-user";
import { requireCurrentUser } from "../../infrastructure/auth/require-current-user";
import { ok } from "../../shared/http/api-response";
import {
  currentActionPlanController,
  generateActionPlanController,
} from "../controllers/action-plan.controller";
import { generateAdaptiveProfileController } from "../controllers/adaptive-engine.controller";
import {
  adminDeleteSubscriptionPlanController,
  adminInvestigationQuestionsController,
  adminOperationalQuestionsController,
  adminPaymentProviderController,
  adminSaveInvestigationQuestionsController,
  adminSaveOperationalQuestionsController,
  adminSavePaymentProviderController,
  adminSaveSubscriptionPlanController,
  adminSaveTriageQuestionsController,
  adminSessionController,
  adminSubscriptionPlansController,
  adminTriageQuestionsController,
  adminUpdateUserController,
  adminUsersController,
} from "../controllers/admin.controller";
import {
  checkInHistoryController,
  saveCheckInController,
  todayCheckInController,
} from "../controllers/check-in.controller";
import {
  completeCycleController,
  currentCycleController,
  startNextCycleController,
} from "../controllers/cycle.controller";
import { currentCycleReportController } from "../controllers/cycle-report.controller";
import { dashboardController } from "../controllers/dashboard.controller";
import {
  completeInvestigationController,
  currentInvestigationController,
  recordInvestigationAnswerController,
} from "../controllers/investigation.controller";
import {
  getMeController,
  uploadAvatarController,
  upsertProfileController,
} from "../controllers/me.controller";
import {
  onboardingStatusController,
  saveAnamneseController,
} from "../controllers/onboarding.controller";
import {
  completeOperationalAssessmentController,
  currentOperationalAssessmentController,
  recordOperationalAnswerController,
} from "../controllers/operational-assessment.controller";
import { checkoutController } from "../controllers/payment.controller";
import {
  completeTriageController,
  currentTriageResultController,
  currentTriageSessionController,
  recordTriageAnswerController,
  triageQuestionsController,
  triageTieBreakController,
} from "../controllers/triage.controller";
import { actionPlanBodySchema } from "../dtos/action-plan.dto";
import {
  adminInvestigationQuestionsBodySchema,
  adminOperationalQuestionsBodySchema,
  adminTriageQuestionsBodySchema,
  paymentProviderBodySchema,
  subscriptionPlanBodySchema,
  updateUserAdminBodySchema,
} from "../dtos/admin.dto";
import { anamneseBodySchema } from "../dtos/anamnese.dto";
import { genericAnswerBodySchema } from "../dtos/answer.dto";
import { checkInBodySchema } from "../dtos/check-in.dto";
import { operationalAnswerBodySchema } from "../dtos/operational-assessment.dto";
import { profileBodySchema } from "../dtos/profile.dto";
import { triageAnswerBodySchema, triageTieBreakBodySchema } from "../dtos/triage.dto";
import { authMiddleware } from "../middlewares/auth-middleware";

async function requireProductUser(headers: Record<string, string | undefined>) {
  return requireActiveUser(await requireCurrentUser(headers));
}

export const protectedRoutes = new Elysia()
  .use(authMiddleware)
  .get("/me", async ({ headers }) => ok(await getMeController(await requireCurrentUser(headers))))
  .post(
    "/me/profile",
    async ({ headers, body }) =>
      ok(await upsertProfileController(await requireCurrentUser(headers), body)),
    {
      body: profileBodySchema,
    },
  )
  .post("/me/avatar", async ({ headers, body }) =>
    ok(
      await uploadAvatarController(
        await requireCurrentUser(headers),
        (body as { avatar?: File }).avatar,
      ),
    ),
  )
  .post(
    "/onboarding/anamnesis",
    async ({ headers, body }) =>
      ok(await saveAnamneseController(await requireCurrentUser(headers), body)),
    { body: anamneseBodySchema },
  )
  .get("/onboarding/status", async ({ headers }) =>
    ok(await onboardingStatusController(await requireCurrentUser(headers))),
  )
  .get("/triage/questions", async () => ok(await triageQuestionsController()))
  .get("/triage/current-session", async ({ headers }) =>
    ok(await currentTriageSessionController(await requireCurrentUser(headers))),
  )
  .post(
    "/triage/answer",
    async ({ headers, body }) =>
      ok(await recordTriageAnswerController(await requireCurrentUser(headers), body)),
    { body: triageAnswerBodySchema },
  )
  .post("/triage/complete", async ({ headers }) =>
    ok(await completeTriageController(await requireCurrentUser(headers))),
  )
  .post(
    "/triage/tie-break",
    async ({ headers, body }) =>
      ok(await triageTieBreakController(await requireCurrentUser(headers), body)),
    { body: triageTieBreakBodySchema },
  )
  .get("/triage/current-result", async ({ headers }) =>
    ok(await currentTriageResultController(await requireCurrentUser(headers))),
  )
  .get("/investigation/current", async ({ headers }) =>
    ok(await currentInvestigationController(await requireCurrentUser(headers))),
  )
  .post(
    "/investigation/answer",
    async ({ headers, body }) =>
      ok(await recordInvestigationAnswerController(await requireCurrentUser(headers), body)),
    { body: genericAnswerBodySchema },
  )
  .post("/investigation/complete", async ({ headers }) =>
    ok(await completeInvestigationController(await requireCurrentUser(headers))),
  )
  .get("/operational-assessment/current", async ({ headers }) =>
    ok(await currentOperationalAssessmentController(await requireCurrentUser(headers))),
  )
  .post(
    "/operational-assessment/answer",
    async ({ headers, body }) =>
      ok(await recordOperationalAnswerController(await requireCurrentUser(headers), body)),
    { body: operationalAnswerBodySchema },
  )
  .post("/operational-assessment/complete", async ({ headers }) =>
    ok(await completeOperationalAssessmentController(await requireCurrentUser(headers))),
  )
  .post("/adaptive-engine/generate-profile", async ({ headers }) =>
    ok(await generateAdaptiveProfileController(await requireProductUser(headers))),
  )
  .post(
    "/action-plan/generate",
    async ({ headers, body }) =>
      ok(await generateActionPlanController(await requireProductUser(headers), body)),
    { body: actionPlanBodySchema },
  )
  .get("/action-plan/current", async ({ headers }) =>
    ok(await currentActionPlanController(await requireProductUser(headers))),
  )
  .get("/dashboard", async ({ headers }) =>
    ok(await dashboardController(await requireCurrentUser(headers))),
  )
  .get("/checkout", async ({ headers }) =>
    ok(await checkoutController(await requireCurrentUser(headers))),
  )
  .post(
    "/check-in",
    async ({ headers, body }) =>
      ok(await saveCheckInController(await requireProductUser(headers), body)),
    {
      body: checkInBodySchema,
    },
  )
  .get("/check-in/today", async ({ headers }) =>
    ok(await todayCheckInController(await requireProductUser(headers))),
  )
  .get("/check-in/history", async ({ headers }) =>
    ok(await checkInHistoryController(await requireProductUser(headers))),
  )
  .get("/cycle/current", async ({ headers }) =>
    ok(await currentCycleController(await requireProductUser(headers))),
  )
  .post("/cycle/complete", async ({ headers }) =>
    ok(await completeCycleController(await requireProductUser(headers))),
  )
  .post("/cycle/start-next", async ({ headers }) =>
    ok(await startNextCycleController(await requireProductUser(headers))),
  )
  .get("/cycle-report/current", async ({ headers }) =>
    ok(await currentCycleReportController(await requireProductUser(headers))),
  )
  .get("/admin/users", async ({ headers }) => {
    await requireAdminUser(headers);
    return ok(await adminUsersController());
  })
  .get("/admin/session", async ({ headers }) => {
    const currentUser = await requireAdminUser(headers);
    return ok(adminSessionController(currentUser));
  })
  .patch(
    "/admin/users/:uid",
    async ({ headers, params, body }) => {
      await requireAdminUser(headers);
      return ok(await adminUpdateUserController(params.uid, body));
    },
    { body: updateUserAdminBodySchema },
  )
  .get("/admin/subscription-plans", async ({ headers }) => {
    await requireAdminUser(headers);
    return ok(await adminSubscriptionPlansController());
  })
  .post(
    "/admin/subscription-plans",
    async ({ headers, body }) => {
      await requireAdminUser(headers);
      return ok(await adminSaveSubscriptionPlanController(body));
    },
    { body: subscriptionPlanBodySchema },
  )
  .delete("/admin/subscription-plans/:planId", async ({ headers, params }) => {
    await requireAdminUser(headers);
    return ok(await adminDeleteSubscriptionPlanController(params.planId));
  })
  .get("/admin/payment-provider", async ({ headers }) => {
    await requireAdminUser(headers);
    return ok(await adminPaymentProviderController());
  })
  .put(
    "/admin/payment-provider",
    async ({ headers, body }) => {
      await requireAdminUser(headers);
      return ok(await adminSavePaymentProviderController(body));
    },
    { body: paymentProviderBodySchema },
  )
  .get("/admin/triage/questions", async ({ headers }) => {
    await requireAdminUser(headers);
    return ok(await adminTriageQuestionsController());
  })
  .put(
    "/admin/triage/questions",
    async ({ headers, body }) => {
      await requireAdminUser(headers);
      return ok(await adminSaveTriageQuestionsController(body));
    },
    { body: adminTriageQuestionsBodySchema },
  )
  .get("/admin/investigation/questions/:priorityVector", async ({ headers, params }) => {
    await requireAdminUser(headers);
    return ok(await adminInvestigationQuestionsController(params.priorityVector as never));
  })
  .put(
    "/admin/investigation/questions",
    async ({ headers, body }) => {
      await requireAdminUser(headers);
      return ok(await adminSaveInvestigationQuestionsController(body));
    },
    { body: adminInvestigationQuestionsBodySchema },
  )
  .get("/admin/operational-assessment/questions", async ({ headers }) => {
    await requireAdminUser(headers);
    return ok(await adminOperationalQuestionsController());
  })
  .put(
    "/admin/operational-assessment/questions",
    async ({ headers, body }) => {
      await requireAdminUser(headers);
      return ok(await adminSaveOperationalQuestionsController(body));
    },
    { body: adminOperationalQuestionsBodySchema },
  );
