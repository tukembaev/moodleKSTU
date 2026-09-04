import mockData from "../mocks/statisticsMockData.json";
import type {
  StudentCourseDetail,
  StudentDashboard,
  TeacherCourseDetail,
  TeacherDashboard,
} from "../types/statistics";

export const getStudentDashboard = async (): Promise<StudentDashboard> => {
  return mockData.student.dashboard as StudentDashboard;
};

export const getTeacherDashboard = async (): Promise<TeacherDashboard> => {
  return mockData.teacher.dashboard as TeacherDashboard;
};

export const getStudentCourseDetail = async (
  _courseId: string
): Promise<StudentCourseDetail> => {
  return mockData.student.course_detail as unknown as StudentCourseDetail;
};

export const getTeacherCourseDetail = async (
  _courseId: string
): Promise<TeacherCourseDetail> => {
  return mockData.teacher.course_detail as unknown as TeacherCourseDetail;
};
