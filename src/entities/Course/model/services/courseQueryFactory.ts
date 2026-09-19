import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import axios from 'axios';
import { deleteCourse, getAnswerTask, getCourseAllTasks, getCoursesOfProfessor, getCourseAnnouncements, getCourseFeed, getCourseInviteLink, getCourseMaterials, getCourseStreams, getCourseTablePerfomance, getMySubmissions, getStudentAnswers, getTaskMaterials, getThemeDiscussion, getThemeFAQ, getCourseModules, getWeekThemes, getCourseTests } from './courseAPI';
import { getStudentCourseDetail, getStudentDashboard, getTeacherCourseDetail, getTeacherDashboard } from './statisticsAPI';

import { delete_material, useAddComment, useBindCourseStreams, useChangeDetails, useChangePermission, useCreateAnnouncement, useCreateAnswer, useCreateCourse, useCreateCourseInvite, useCreateFAQ, useCreateMaterial, useCreateTheme, useDeleteAnnouncement, useDeleteAnswer, useDeleteCourseInvite, useDeleteCourseStream, useDeleteTheme, useDuplicateCourse, useEditTheme, useFinishCourse, useRateAnswerAndComment, useRateComment, useRemoveStudentFromCourse, useReplyToComment, useSetThemeAccessForAll, useUpdateAnnouncement } from 'features/Course/model/services/course_queries';




export const courseQueries = {
  //----------GET QUERIES------------
  allCourses: () =>
    queryOptions({
      queryKey: ['course'],
      queryFn: () => getCoursesOfProfessor(),
    }),
    allTasks: (id: string | null) =>
      queryOptions({
        queryKey: ['course','course-all-themes',id],
        queryFn: () => getCourseAllTasks(id as string),
        enabled: !!id,
      }),
    allTaskMaterials: (id: string | null) =>
        queryOptions({
          queryKey: ['course','task-materials', id],
          queryFn: () => getTaskMaterials(id as string),
          enabled: !!id,
        }),
    allAnswerTask: (id: string | null) =>
          queryOptions({
            queryKey: ['answer-task', id],
            queryFn: () => getAnswerTask(id as string),
            enabled: !!id,
          }),
    allStudentAnswers: (id: string | null) =>
            queryOptions({
              queryKey: ['student-answer-task', id],
              queryFn: () => getStudentAnswers(id as string),
              enabled: !!id,
            }),
      allStudentPerfomance: (id: string | null) =>
              queryOptions({
                queryKey: ['table-perfomance',id],
                queryFn: () => getCourseTablePerfomance(id as string),
                enabled: !!id,
              }),
      mySubmissions: (courseId: string | null) =>
              queryOptions({
                queryKey: ['course', 'my-submissions', courseId],
                queryFn: () => getMySubmissions(courseId as string),
                enabled: !!courseId,
                retry: (failureCount, error) => {
                  if (
                    axios.isAxiosError(error) &&
                    [401, 403, 404].includes(error.response?.status ?? 0)
                  ) {
                    return false;
                  }
                  return failureCount < 2;
                },
              }),
      courseMaterials: (courseId: string | null, search?: string) =>
              queryOptions({
                queryKey: ['course', 'course-materials', courseId, search || ''],
                queryFn: () => getCourseMaterials(courseId as string, search),
                enabled: !!courseId,
                placeholderData: keepPreviousData,
                retry: (failureCount, error) => {
                  if (
                    axios.isAxiosError(error) &&
                    [401, 403, 404].includes(error.response?.status ?? 0)
                  ) {
                    return false;
                  }
                  return failureCount < 2;
                },
              }),
      announcements: (courseId: string | null) =>
              queryOptions({
                queryKey: ['course', 'announcements', courseId],
                queryFn: () => getCourseAnnouncements(courseId as string),
                enabled: !!courseId,
                retry: (failureCount, error) => {
                  if (
                    axios.isAxiosError(error) &&
                    [401, 403, 404].includes(error.response?.status ?? 0)
                  ) {
                    return false;
                  }
                  return failureCount < 2;
                },
              }),
      feed: (
        courseId: string | null,
        sort: "desc" | "asc" = "desc",
        kind: "all" | "announcement" | "materials" = "all"
      ) =>
              queryOptions({
                queryKey: ['course', 'feed', courseId, sort, kind],
                queryFn: () =>
                  getCourseFeed(courseId as string, { sort, kind }),
                enabled: !!courseId,
                placeholderData: keepPreviousData,
                retry: (failureCount, error) => {
                  if (
                    axios.isAxiosError(error) &&
                    [401, 403, 404].includes(error.response?.status ?? 0)
                  ) {
                    return false;
                  }
                  return failureCount < 2;
                },
              }),
    allThemeFAQ: (theme: string | null) =>
              queryOptions({
                queryKey: ['faq',theme],
                queryFn: () => getThemeFAQ(theme as string),
                enabled: !!theme,
              }),

      allThemeFeed: (theme: string | null) =>
                queryOptions({
                  queryKey: ['discussion',theme],
                  queryFn: () => getThemeDiscussion(theme as string),
                  enabled: !!theme,
                }),
      courseModules: (course_id: string | null) =>
                queryOptions({
                  queryKey: ['course', 'modules', course_id],
                  queryFn: () => getCourseModules(course_id as string),
                  enabled: !!course_id,
                }),
      weekThemes: (week_id: string | null) =>
                queryOptions({
                  queryKey: ['week', 'themes', week_id],
                  queryFn: () => getWeekThemes(week_id as string),
                  enabled: !!week_id,
                }),
      // Тесты курса
      courseTests: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['course', 'tests', courseId],
                  queryFn: () => getCourseTests(courseId),
                  enabled: !!courseId,
                }),
      courseStreams: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['course', 'streams', courseId],
                  queryFn: () => getCourseStreams(courseId),
                  enabled: !!courseId,
                }),
      courseInviteLink: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['course', 'invite-link', courseId],
                  queryFn: () => getCourseInviteLink(courseId as string),
                  enabled: !!courseId,
                }),
      studentDashboard: () =>
                queryOptions({
                  queryKey: ['statistics', 'student', 'dashboard'],
                  queryFn: () => getStudentDashboard(),
                }),
      teacherDashboard: () =>
                queryOptions({
                  queryKey: ['statistics', 'teacher', 'dashboard'],
                  queryFn: () => getTeacherDashboard(),
                }),
      studentCourseDetail: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['statistics', 'student', 'course', courseId],
                  queryFn: () => getStudentCourseDetail(courseId as string),
                  enabled: !!courseId,
                }),
      teacherCourseDetail: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['statistics', 'teacher', 'course', courseId],
                  queryFn: () => getTeacherCourseDetail(courseId as string),
                  enabled: !!courseId,
                }),
  
  //----------POST QUERIES------------
      
  create_course: () => useCreateCourse(),
  duplicate_course: () => useDuplicateCourse(),
  create_theme: () => useCreateTheme(),
  create_faq: () => useCreateFAQ(),
  create_material: () => useCreateMaterial(),
  create_answer: () => useCreateAnswer(),
  rate_answer: () => useRateAnswerAndComment(),
  finish_course: () => useFinishCourse(),
  bind_course_streams: () => useBindCourseStreams(),
  create_course_invite: () => useCreateCourseInvite(),
  create_announcement: () => useCreateAnnouncement(),
  edit_announcement: () => useUpdateAnnouncement(),


  add_comment: () => useAddComment(),
  reply_comment: () => useReplyToComment(),
  like_comment: () => useRateComment(),


  edit_details: () => useChangeDetails(),
  edit_permission: () => useChangePermission(),
  edit_theme: () => useEditTheme(),
  set_theme_access_for_all: () => useSetThemeAccessForAll(),


  




  deleteCourse: (id: number) => deleteCourse(id),
  delete_material: () => delete_material(),
  delete_answer: () => useDeleteAnswer(),
  delete_course_stream: () => useDeleteCourseStream(),
  delete_course_invite: () => useDeleteCourseInvite(),
  delete_theme: () => useDeleteTheme(),
  remove_student: () => useRemoveStudentFromCourse(),
  delete_announcement: () => useDeleteAnnouncement(),


};
