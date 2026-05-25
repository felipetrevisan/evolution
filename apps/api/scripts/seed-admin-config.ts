import {
  getInvestigationQuestions,
  OPERATIONAL_QUESTIONS,
  TRIAGE_QUESTIONS,
  VECTOR_KEYS,
} from "@evolution/domain";
import { getFirestoreDb } from "../src/infrastructure/firebase/admin";
import { createAdminConfigRepository } from "../src/infrastructure/repositories/admin-config-repository";

const adminConfig = createAdminConfigRepository(getFirestoreDb());

try {
  await adminConfig.saveTriageQuestions(TRIAGE_QUESTIONS);
  await adminConfig.saveOperationalQuestions(OPERATIONAL_QUESTIONS);
  await adminConfig.saveInvestigationQuestions(
    Object.fromEntries(
      VECTOR_KEYS.map((vector) => [vector, getInvestigationQuestions(vector)]),
    ) as Record<(typeof VECTOR_KEYS)[number], ReturnType<typeof getInvestigationQuestions>>,
  );

  console.log("Admin config seeded in Firestore.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const metadata = readErrorMetadata(error);

  console.error("Falha ao rodar seed do Firestore.");
  console.error(`Erro: ${message}`);

  if (metadata?.service === "firestore.googleapis.com") {
    console.error("Causa provável: Cloud Firestore API desabilitada no projeto Firebase.");
  }

  if (metadata?.activationUrl) {
    console.error(`Habilite aqui: ${metadata.activationUrl}`);
  }

  process.exit(1);
}

function readErrorMetadata(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  const errorInfoMetadata = (error as { errorInfoMetadata?: unknown }).errorInfoMetadata;

  return errorInfoMetadata && typeof errorInfoMetadata === "object"
    ? (errorInfoMetadata as { activationUrl?: string; service?: string })
    : null;
}
