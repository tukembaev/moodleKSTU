import { queryOptions } from '@tanstack/react-query';

import { deleteCourse, getAnswerTask, getCourseAllTasks, getCoursesOfProfessor, getCourseStreams, getCourseTablePerfomance, getStudentAnswers, getTaskMaterials, getThemeDiscussion, getThemeFAQ, getCourseModules, getWeekThemes, getCourseTests } from './courseAPI';
import { getStudentCourseDetail, getStudentDashboard, getTeacherCourseDetail, getTeacherDashboard } from './statisticsAPI';

import { delete_material, useAddComment, useBindCourseStreams, useChangeDetails, useChangePermission, useCreateAnswer, useCreateCourse, useCreateFAQ, useCreateMaterial, useCreateTheme, useDeleteAnswer, useDeleteCourseStream, useDeleteTheme, useDuplicateCourse, useEditTheme, useFinishCourse, useRateAnswerAndComment, useRateComment, useRemoveStudentFromCourse, useReplyToComment, useSetThemeAccessForAll } from 'features/Course/model/services/course_queries';




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
  delete_theme: () => useDeleteTheme(),
  remove_student: () => useRemoveStudentFromCourse(),


};
