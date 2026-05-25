import type { UserScopedRepository } from "../../repositories/base-repository";
import type { TriageSessionRecord } from "./record-triage-answer";

export async function getCurrentTriageSession(
  uid: string,
  repository: UserScopedRepository<TriageSessionRecord>,
) {
  const sessions = await repository.list(uid, 100);
  const inProgressSessions = sessions
    .filter((session) => session.status === "in_progress")
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

  if (inProgressSessions.length === 0) {
    return null;
  }

  const latestSession = inProgressSessions.at(-1);

  if (!latestSession) {
    return null;
  }

  return {
    ...latestSession,
    answers: mergeAnswersByQuestion(inProgressSessions),
  };
}

function mergeAnswersByQuestion(sessions: TriageSessionRecord[]) {
  const answersByQuestion = new Map<number, TriageSessionRecord["answers"]>();

  for (const session of sessions) {
    const groupedAnswers = new Map<number, TriageSessionRecord["answers"]>();

    for (const answer of session.answers) {
      groupedAnswers.set(answer.questionId, [
        ...(groupedAnswers.get(answer.questionId) ?? []),
        answer,
      ]);
    }

    for (const [questionId, answers] of groupedAnswers) {
      answersByQuestion.set(questionId, answers);
    }
  }

  return [...answersByQuestion.values()].flat();
}
