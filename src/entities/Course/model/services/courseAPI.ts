import { CreateCoursePayload, CreateFAQPayload, CreateThemePayload, editPermissionPayload } from "features/Course";
import $api_edu from "shared/api/api_edu";
import $api_users from "shared/api/api_users";
import { Course, CourseMaterials, CourseThemes, FeedItem, FileAnswer, StudentsAnswers, TablePerfomance, ThemeFaq } from "../types/course";
import { ExtraPointPayload, FinishCoursePayload, RateAnswerPayload } from "features/Course/model/types/course_payload";
import $api_base_edu from "shared/api/api_base_edu";



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