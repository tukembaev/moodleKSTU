import type { TestQuestion } from "../types/test";
import { readAttemptDraft, writeAttemptDraft } from "./attemptDraftCache";

const shuffle = <T>(items: T[]): T[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
};

const byIds = (questions: TestQuestion[], ids: string[]) => {
  const byId = new Map(questions.map((question) => [question.id, question]));
  return ids
    .map((id) => byId.get(id))
    .filter((question): question is TestQuestion => Boolean(question));
};

/**
 * Questions the student sees in this attempt.
 * Uses the server draw when present. Otherwise samples once from the bank
 * and pins the ids in the local attempt draft so a refresh does not reshuffle.
 */
export const resolveAttemptQuestions = (
  testId: string,
  questions: TestQuestion[],
  questionsPerAttempt?: number,
  attemptQuestionIds?: string[]
): TestQuestion[] => {
  if (attemptQuestionIds?.length) {
    const served = byIds(questions, attemptQuestionIds);
    if (served.length) return served;
  }

  const limit = questionsPerAttempt;
  if (!limit || limit >= questions.length) return questions;

  const pinned = readAttemptDraft(testId)?.questionIds;
  if (pinned?.length) {
    const served = byIds(questions, pinned);
    if (served.length) return served.slice(0, limit);
  }

  const picked = shuffle(questions).slice(0, limit);
  const draft = readAttemptDraft(testId);
  if (draft) {
    writeAttemptDraft(testId, {
      ...draft,
      questionIds: picked.map((question) => question.id),
    });
  }
  return picked;
};
