import type { SavedAttemptAnswer, TestAnswer } from "../types/test";

const storageKey = (testId: string) => `test-attempt-draft:${testId}`;

export interface LocalAttemptDraft {
  startedAt: number;
  timeLimitSeconds: number;
  answers: SavedAttemptAnswer[];
}

const emptyAnswers = (
  answers: Array<TestAnswer | SavedAttemptAnswer> | undefined
): SavedAttemptAnswer[] => {
  if (!Array.isArray(answers)) return [];
  return answers.map((item) => ({
    questionId: item.questionId,
    selectedOptions: item.selectedOptions ?? [],
    textAnswer: item.textAnswer ?? "",
  }));
};

export const readAttemptDraft = (testId: string): LocalAttemptDraft | null => {
  try {
    const raw = localStorage.getItem(storageKey(testId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalAttemptDraft | TestAnswer[];
    if (Array.isArray(parsed)) {
      return null;
    }
    if (!parsed?.startedAt || typeof parsed.timeLimitSeconds !== "number") {
      return null;
    }
    return {
      startedAt: parsed.startedAt,
      timeLimitSeconds: parsed.timeLimitSeconds,
      answers: emptyAnswers(parsed.answers),
    };
  } catch {
    return null;
  }
};

export const writeAttemptDraft = (testId: string, draft: LocalAttemptDraft) => {
  try {
    localStorage.setItem(storageKey(testId), JSON.stringify(draft));
  } catch {
    // quota / private mode
  }
};

export const clearAttemptDraft = (testId: string) => {
  try {
    localStorage.removeItem(storageKey(testId));
  } catch {
    // ignore
  }
};

export const remainingSecondsFromDraft = (draft: LocalAttemptDraft): number => {
  if (!draft.timeLimitSeconds) return 0;
  const elapsed = Math.floor((Date.now() - draft.startedAt) / 1000);
  return Math.max(0, draft.timeLimitSeconds - elapsed);
};

export const ensureAttemptDraft = (
  testId: string,
  timeLimitSeconds: number
): LocalAttemptDraft => {
  const existing = readAttemptDraft(testId);
  if (existing) {
    if (existing.timeLimitSeconds !== timeLimitSeconds) {
      const next = { ...existing, timeLimitSeconds };
      writeAttemptDraft(testId, next);
      return next;
    }
    return existing;
  }
  const created: LocalAttemptDraft = {
    startedAt: Date.now(),
    timeLimitSeconds,
    answers: [],
  };
  writeAttemptDraft(testId, created);
  return created;
};

export const saveDraftAnswers = (
  testId: string,
  answers: Array<TestAnswer | SavedAttemptAnswer>
) => {
  const existing = readAttemptDraft(testId);
  if (!existing) return;
  writeAttemptDraft(testId, {
    ...existing,
    answers: emptyAnswers(answers),
  });
};

export const hasActiveLocalAttempt = (testId: string): boolean => {
  const draft = readAttemptDraft(testId);
  if (!draft) return false;
  return remainingSecondsFromDraft(draft) > 0;
};
