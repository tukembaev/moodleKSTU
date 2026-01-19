import { CreateCoursePayload, CreateFAQPayload, CreateThemePayload, editPermissionPayload } from "features/Course";
import { CourseAboutData, UpdateCourseAboutPayload } from "../types/courseAbout";
import $api_edu from "shared/api/api_edu";
import $api_users from "shared/api/api_users";
import { Course, CourseMaterials, CourseThemes, FeedItem, FileAnswer, StudentsAnswers, TablePerfomance, ThemeFaq, WeekTheme, CourseModulesResponse } from "../types/course";
import { ExtraPointPayload, FinishCoursePayload, RateAnswerPayload } from "features/Course/model/types/course_payload";
import $api_base_edu from "shared/api/api_base_edu";
import { StudentDashboard, StudentCourseDetail, TeacherDashboard, TeacherCourseDetail } from "../types/statistics";



//Все курсы/дисциплины преподавателя
export const getCoursesOfProfessor = async ():Promise<Course[]> => {
    const response = await $api_users.get(`my-courses/`); 
    return response.data;
  };
//Все задания выбранной дисциплины
  export const getCourseAllTasks = async (id: string | null):Promise<CourseThemes> => {
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
  return response.data;
};
export const getThemeDiscussion = async (theme: string | null):Promise<FeedItem[]> => {
  const response = await $api_base_edu.get(`v1/chats/discussion/${theme}/`); 
  return response.data;
};
export const getCourseTablePerfomance = async (id: string | null):Promise<TablePerfomance[]> => {
    const response = await $api_edu.get(`table-performance/${id}/`); 
    return response.data;
  };
export const getCourseModules = async (course_id: string):Promise<CourseModulesResponse> => {
    const response = await $api_edu.get(`modules/${course_id}/`); 
    return response.data;
  };
export const getWeekThemes = async (week_id: string):Promise<WeekTheme[]> => {
    const response = await $api_edu.get(`thems/${week_id}/`); 
    return response.data;
  };

export const getCourseAbout = async (courseId: string): Promise<CourseAboutData> => {
  const response = await $api_edu.get(`course-about/${courseId}/`);
  return response.data;
};

export const updateCourseAbout = async (
  courseId: string,
  data: UpdateCourseAboutPayload
): Promise<CourseAboutData> => {
  const response = await $api_edu.patch(`course-about/${courseId}/`, data);
  return response.data;
};

export const createCourse = async (data:CreateCoursePayload) => {
  const response = await $api_edu.post(`course/`,data); 
  return response.data;
};
export const createTheme = async (data:CreateThemePayload) => {
  const response = await $api_edu.post(`course-detail/`,data); 
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
  const response = await $api_edu.delete(`material/${id}/`); 
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

// Статистика для студентов
export const getStudentDashboard = async (): Promise<StudentDashboard> => {
  try {
    const response = await $api_edu.get(`statistics/student/dashboard/`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Нет доступа к статистике студента. Убедитесь, что вы авторизованы как студент.");
    }
    if (error.response?.status === 404) {
      throw new Error("Статистика не найдена.");
    }
    throw new Error(error.response?.data?.error || error.message || "Ошибка при получении статистики студента");
  }
};

export const getStudentCourseDetail = async (courseId: string): Promise<StudentCourseDetail> => {
  if (!courseId) {
    throw new Error("ID курса обязателен");
  }
  try {
    const response = await $api_edu.get(`statistics/student/course/${courseId}/`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Нет доступа к статистике курса. Убедитесь, что вы зарегистрированы на этот курс.");
    }
    if (error.response?.status === 404) {
      throw new Error("Курс не найден или нет доступа к статистике.");
    }
    throw new Error(error.response?.data?.error || error.message || "Ошибка при получении статистики курса");
  }
};

// Статистика для учителей
export const getTeacherDashboard = async (): Promise<TeacherDashboard> => {
  try {
    const response = await $api_edu.get(`statistics/teacher/dashboard/`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Нет доступа к статистике учителя. Убедитесь, что вы авторизованы как учитель.");
    }
    if (error.response?.status === 404) {
      throw new Error("Статистика не найдена.");
    }
    throw new Error(error.response?.data?.error || error.message || "Ошибка при получении статистики учителя");
  }
};

export const getTeacherCourseDetail = async (courseId: string): Promise<TeacherCourseDetail> => {
  if (!courseId) {
    throw new Error("ID курса обязателен");
  }
  try {
    const response = await $api_edu.get(`statistics/teacher/course/${courseId}/`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Нет доступа к статистике курса. Убедитесь, что вы являетесь владельцем этого курса.");
    }
    if (error.response?.status === 404) {
      throw new Error("Курс не найден или нет доступа к статистике.");
    }
    throw new Error(error.response?.data?.error || error.message || "Ошибка при получении статистики курса");
  }
};