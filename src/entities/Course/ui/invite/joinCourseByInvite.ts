import axios from "axios";
import { registerToCourse } from "entities/Course/model/services/courseAPI";
import type { RegisterToCoursePayload } from "entities/Course/model/types/course";

const ALREADY_MEMBER_RE =
  /уже\s+(состоит|записан|добавлен|участник)|already\s+(enrolled|a member|joined|registered)|already exists/i;

export function isAlreadyMemberJoinError(error: unknown): boolean {
  if (
    axios.isAxiosError(error) &&
    [400, 409].includes(error.response?.status ?? 0)
  ) {
    const data = error.response?.data as
      | { error?: string; message?: string; detail?: string }
      | undefined;
    const apiMessage = data?.error || data?.message || data?.detail || "";
    if (!apiMessage) return error.response?.status === 409;
    return ALREADY_MEMBER_RE.test(apiMessage);
  }
  const message = error instanceof Error ? error.message : String(error ?? "");
  return ALREADY_MEMBER_RE.test(message);
}

/**
 * Sends a join request from a QR/invite link.
 * Calls POST /api/v1/users/registration-course/ with { course_id, link_id }.
 */
export async function joinCourseByInvite(
  data: RegisterToCoursePayload
): Promise<void> {
  try {
    await registerToCourse(data);
  } catch (error: unknown) {
    if (isAlreadyMemberJoinError(error)) {
      throw new Error("Вы уже состоите в этом курсе");
    }

    const apiMessage = axios.isAxiosError(error)
      ? (
          error.response?.data as
            | { error?: string; message?: string; detail?: string }
            | undefined
        )?.error ||
        (
          error.response?.data as
            | { error?: string; message?: string; detail?: string }
            | undefined
        )?.message ||
        (
          error.response?.data as
            | { error?: string; message?: string; detail?: string }
            | undefined
        )?.detail
      : null;

    throw new Error(apiMessage || "Не удалось отправить заявку на вступление");
  }
}
