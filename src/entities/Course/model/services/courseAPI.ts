import axios from "axios";
import { BindCourseStreamsPayload, CreateCoursePayload, CreateFAQPayload, CreateThemePayload, EditThemePayload, editPermissionPayload } from "features/Course";
import { ExtraPointPayload, FinishCoursePayload, RateAnswerPayload } from "features/Course/model/types/course_payload";
import $api_base_edu from "shared/api/api_base_edu";
import $api_edu from "shared/api/api_edu";
import $api_users from "shared/api/api_users";
import {
  getCourseInviteUrl,
  isUuid,
  parseCourseInviteIdsFromHref,
} from "shared/lib/navigation/hidden-ids";
import {
  fallbackSpreadsheetFileName,
  filenameFromContentDisposition,
  saveBlobAsFile,
} from "shared/lib/downloadFile";
import {
  normalizeFeedItem,
  unwrapList,
} from "entities/Course/lib/courseFeed";
import { Course, CourseAllMaterials, CourseAnnouncement, CourseFeedItem, CourseFeedQuery, CourseInviteLink, CourseMaterialFile, CourseMaterials, CourseModulesResponse, CourseStream, CreateAnnouncementPayload, CreateCourseInvitePayload, FeedItem, FileAnswer, MySubmissionsResponse, RegisterToCoursePayload, StudentsAnswers, TablePerfomance, ThemeAttendance, ThemeAttendanceStudent, ThemeFaq, UpdateAnnouncementPayload, UpdateThemeAttendancePayload, WeekTheme } from "../types/course";
import { Test } from "entities/Test/model/types/test";



//Все курсы/дисциплины преподавателя
export const getCoursesOfProfessor = async ():Promise<Course[]> => {
    const response = await $api_users.get(`my-courses/`); 
    return response.data;
  };
//Все задания выбранной дисциплины
  export const getCourseAllTasks = async (id: string | null):Promise<CourseAllMaterials> => {
    const response = await $api_edu.get(`course-theme/${id}/`); 
    return response.data;
  };
//Все уроки и материалы выбранного задани
export const getTaskMaterials = async (id: string | null):Promise<CourseMaterials[]> => {
  const response = await $api_edu.get(`course-detail/${id}/`); 
  return response.data.data;
};
export const getAnswerTask = async (id: string | null):Promise<StudentsAnswers[]> => {
  const response = await $api_edu.get(`answer-task/${id}/`); 
  return response.data;
};
export const getStudentAnswers = async (id: string | null):Promise<FileAnswer[]> => {
  const response = await $api_edu.get(`student-task-files/${id}/`); 
  return response.data;
};
export const getThemeFAQ = async (theme: string | null):Promise<ThemeFaq[]> => {
  const response = await $api_edu.get(`faq/${theme}/`);
  const faqs: ThemeFaq[] = Array.isArray(response.data) ? response.data : [];
  // Backend list endpoint ignores the theme in the URL and returns every FAQ.
  return faqs.filter((faq) => faq.theme === theme);
};
export const getThemeDiscussion = async (theme: string | null):Promise<FeedItem[]> => {
  const response = await $api_base_edu.get(`v1/chats/discussion/${theme}/`); 
  return response.data;
};
export const getCourseTablePerfomance = async (id: string | null):Promise<TablePerfomance[]> => {
    const response = await $api_edu.get(`table-performance/${id}/`); 
    return response.data;
  };
export const exportCoursePerformance = async (
  courseId: string,
  fallbackFileName?: string
): Promise<void> => {
  const response = await $api_edu.get(`table-performance/${courseId}/export/`, {
    responseType: "blob",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*",
    },
  });
  const blob = response.data as Blob;
  const mime = blob.type || "";
  if (mime.includes("json") || mime.includes("text/html")) {
    const text = await blob.text();
    let message = "Не удалось экспортировать ведомость";
    try {
      const parsed = JSON.parse(text) as { detail?: unknown };
      if (typeof parsed.detail === "string" && parsed.detail.trim()) {
        message = parsed.detail.trim();
      }
    } catch {
      // keep fallback
    }
    throw new Error(message);
  }
  const disposition =
    typeof response.headers.get === "function"
      ? response.headers.get("content-disposition")
      : response.headers["content-disposition"];
  const fileName = filenameFromContentDisposition(
    disposition,
    fallbackFileName || fallbackSpreadsheetFileName()
  );
  saveBlobAsFile(blob, fileName);
};
export const getMySubmissions = async (courseId: string): Promise<MySubmissionsResponse> => {
  const response = await $api_edu.get(`my-submissions/${courseId}/`);
  return response.data;
};
export const getCourseAnnouncements = async (
  courseId: string
): Promise<CourseAnnouncement[]> => {
  const response = await $api_edu.get(`course-announcements/${courseId}/`);
  return Array.isArray(response.data) ? response.data : [];
};

export const getCourseFeed = async (
  courseId: string,
  query: CourseFeedQuery = {}
): Promise<CourseFeedItem[]> => {
  const response = await $api_edu.get(`course-feed/${courseId}/`, {
    params: {
      sort: query.sort ?? "desc",
      kind: query.kind ?? "all",
    },
  });
  return unwrapList(response.data)
    .map(normalizeFeedItem)
    .filter((item): item is CourseFeedItem => item != null);
};

export const themeAttendanceQueryKey = (
  themeId: string | null,
  group?: string | null
) => ["course", "attendance", themeId, group || ""] as const;

export const themeAttendanceThemeKey = (themeId: string | null) =>
  ["course", "attendance", themeId] as const;

export const getThemeAttendance = async (
  themeId: string,
  group?: string
): Promise<ThemeAttendance> => {
  const trimmed = group?.trim();
  const response = await $api_edu.get(`attendance/${themeId}/`, {
    params: trimmed ? { group: trimmed } : undefined,
  });
  return response.data;
};

export const updateThemeAttendance = async (
  themeId: string,
  data: UpdateThemeAttendancePayload
): Promise<ThemeAttendanceStudent> => {
  const response = await $api_edu.patch(`attendance/${themeId}/`, data);
  return response.data;
};

export const createCourseAnnouncement = async (
  courseId: string,
  data: CreateAnnouncementPayload
): Promise<CourseAnnouncement> => {
  const response = await $api_edu.post(`course-announcements/${courseId}/`, data);
  return response.data;
};

export const updateCourseAnnouncement = async (
  courseId: string,
  announcementId: string,
  data: UpdateAnnouncementPayload
): Promise<CourseAnnouncement> => {
  const response = await $api_edu.patch(
    `course-announcements/${courseId}/${announcementId}/`,
    data
  );
  return response.data;
};

export const deleteCourseAnnouncement = async (
  courseId: string,
  announcementId: string
) => {
  const response = await $api_edu.delete(
    `course-announcements/${courseId}/${announcementId}/`
  );
  return response.data;
};

export const getCourseMaterials = async (
  courseId: string,
  search?: string
): Promise<CourseMaterialFile[]> => {
  const q = search?.trim();
  const response = await $api_edu.get(`course-materials/${courseId}/`, {
    params: q ? { search: q } : undefined,
  });
  return Array.isArray(response.data) ? response.data : [];
};
export const getCourseModules = async (course_id: string):Promise<CourseModulesResponse> => {
    const response = await $api_edu.get(`modules/${course_id}/`); 
    return response.data;
  };
export const getWeekThemes = async (week_id: string):Promise<WeekTheme[]> => {
    const response = await $api_edu.get(`thems/${week_id}/`); 
    return response.data;
  };
export const createCourse = async (data:CreateCoursePayload) => {
  const response = await $api_edu.post(`course/`,data); 
  return response.data;
};
export const duplicateCourse = async (id: string) => {
  // Client-side mock until backend duplicate endpoint is ready
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { id, duplicated: true };
};
export const createTheme = async (data:CreateThemePayload) => {
  const response = await $api_edu.post(`course-detail/`,data); 
  return response.data;
};
export const editTheme = async (id: string, data: EditThemePayload) => {
  const response = await $api_edu.patch(`course-detail/${id}/`, data);
  return response.data;
};
export const deleteTheme = async (id: string) => {
  const response = await $api_edu.delete(`course-detail/${id}/`);
  return response.data;
};
export const createFAQ = async (data:CreateFAQPayload) => {
  const response = await $api_edu.post(`faq/`,data); 
  return response.data;
};
export const createMaterial = async (data: FormData) => {
  const response = await $api_edu.post(`material/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
export const createAnswer = async (data: FormData) => {
  const response = await $api_edu.post(`answer-task/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const likeComment = async (comment_id:string) => {
  const response = await $api_base_edu.post(`v1/chats/discussion/like/`,{comment_id:comment_id}); 
  return response.data;
};

export const createComment = async (theme_id:string,text:string) => {
  const response = await $api_base_edu.post(`v1/chats/discussion/`,{theme:theme_id , text:text}); 
  return response.data;
};



export const replyOnComment = async (comment_id:string,text:string) => {
  const response = await $api_base_edu.post(`v1/chats/discussion/reply/`,{comment_id:comment_id , text:text}); 
  return response.data;
};

export const makeIsRead = async (file:string) => {
  const response = await $api_edu.post(`is_read-file/`,{file:file}); 
  return response.data;
};
export const rateTheAnswerAndComment = async (data:RateAnswerPayload) => {
  const response = await $api_edu.post(`scoring/`,data); 
  return response.data;
};
export const editPermissionTheme = async (id:string,data:editPermissionPayload) => {
  const response = await $api_edu.patch(`partial-locked-task/${id}/`,data); 
  return response.data;
};

export const editCourseDetails = async (id: string | null , data: any) => {
  const response = await $api_edu.patch(`course-theme/${id}/`, data); 
  return response.data;
};
export const deleteCourse = async (id: number | null) => {
  const response = await $api_edu.delete(`course/${id}`); 
  return response.data;
};
export const deleteMaterial = async (id: string | null) => {
  const response = await $api_edu.delete(`material/${id}/`); 
  return response.data;
};
export const deleteAnswer = async (id: string | null) => {
  const response = await $api_edu.delete(`student-task-files/${id}/`);
  return response.data;
};
export const finishCourse = async (data:FinishCoursePayload) => {
  const response = await $api_edu.post(`finish-course/`,data); 
  return response.data;
};
export const setExtraPoints = async (data:ExtraPointPayload) => {
  const response = await $api_edu.post(`extra-points/`,data); 
  return response.data;
};

export const getCourseStreams = async (courseId: string | null): Promise<CourseStream[]> => {
  const response = await $api_edu.get(`course-streams/`, {
    params: { course_id: courseId },
  });
  return response.data;
};
export const bindCourseStreams = async (data: BindCourseStreamsPayload) => {
  const response = await $api_edu.post(`course-streams/`, data);
  return response.data;
};
export const deleteCourseStream = async (id: string) => {
  const response = await $api_edu.delete(`course-streams/${id}/`);
  return response.data;
};

// Получить все тесты курса  
export const getCourseTests = async (courseId: string | null): Promise<Test[]> => {
  if (!courseId) return [];
  const response = await $api_edu.get(`testing/`, {
    params: { course_id: courseId },
  });
  return response.data;
};

// Отправить заявку на вступление на курс (по приглашению/QR-коду)
export const registerToCourse = async (data: RegisterToCoursePayload) => {
  const response = await $api_users.post(`registration-course/`, {
    course_id: data.course_id,
    link_id: data.link_id,
  });
  return response.data;
};

export const removeStudentFromCourse = async (
  courseId: string,
  studentId: number
) => {
  const response = await $api_users.delete(`remove/${courseId}/${studentId}/`);
  return response.data;
};

function pickInviteLink(data: unknown): string | null {
  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed || null;
  }
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  for (const key of ["link", "url", "invite_link", "inviteLink"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function pickUuid(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && isUuid(value)) return value;
  }
  return null;
}

function normalizeCourseInvite(
  data: unknown,
  fallbackCourseId: string
): CourseInviteLink | null {
  const rawLink = pickInviteLink(data);
  const record =
    data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const fromLink = rawLink
    ? parseCourseInviteIdsFromHref(rawLink)
    : { courseId: null, linkId: null };

  const courseId =
    fromLink.courseId ||
    (record ? pickUuid(record, ["course_id", "course"]) : null) ||
    fallbackCourseId ||
    null;
  const linkId =
    fromLink.linkId ||
    (record ? pickUuid(record, ["link_id", "linkId", "id"]) : null);

  if (!rawLink && !linkId) return null;

  const link =
    courseId && linkId ? getCourseInviteUrl(courseId, linkId) : rawLink;
  if (!link) return null;

  return {
    link,
    course_id: courseId || undefined,
    link_id: linkId || undefined,
  };
}

export const getCourseInviteLink = async (
  courseId: string
): Promise<CourseInviteLink | null> => {
  try {
    const response = await $api_edu.get(`course-link/${courseId}/`);
    return normalizeCourseInvite(response.data, courseId);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createCourseInviteLink = async (
  data: CreateCourseInvitePayload
): Promise<CourseInviteLink | null> => {
  const response = await $api_edu.post(`course-link/`, data);
  return normalizeCourseInvite(response.data, data.course_id);
};

export const deleteCourseInviteLink = async (courseId: string) => {
  const response = await $api_edu.delete(`course-link/${courseId}/`);
  return response.data;
};