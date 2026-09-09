import axios from "axios";
import { registerToCourse } from "entities/Course/model/services/courseAPI";

/**
 * Sends a join request for the given course id.
 * Calls POST /api/v1/users/registration-course/ with { course_id }.
 */
export async function joinCourseByInvite(courseId: string): Promise<void> {
  try {
    await registerToCourse(courseId);
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
