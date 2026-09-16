import axios from "axios";
import { registerToCourse } from "entities/Course/model/services/courseAPI";
import type { RegisterToCoursePayload } from "entities/Course/model/types/course";

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
    const apiMessage = axios.isAxiosError(error)
      ? (error.response?.data as { error?: string; message?: string; detail?: string } | undefined)
          ?.error ||
        (error.response?.data as { error?: string; message?: string; detail?: string } | undefined)
          ?.message ||
        (error.response?.data as { error?: string; message?: string; detail?: string } | undefined)
          ?.detail
      : null;

    throw new Error(apiMessage || "Не удалось отправить заявку на вступление");
  }
}
