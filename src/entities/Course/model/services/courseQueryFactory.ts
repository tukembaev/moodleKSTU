import { queryOptions } from '@tanstack/react-query';

import { deleteCourse, getAnswerTask, getCourseAllTasks, getCoursesOfProfessor, getCourseTablePerfomance, getStudentAnswers, getTaskMaterials, getThemeDiscussion, getThemeFAQ, getCourseModules, getWeekThemes, getStudentDashboard, getStudentCourseDetail, getTeacherDashboard, getTeacherCourseDetail, getCourseAbout } from './courseAPI';

import { delete_material, useAddComment, useChangeDetails, useChangePermission, useCreateCourse, useCreateFAQ, useCreateMaterial, useCreateTheme, useFinishCourse, useRateAnswerAndComment, useRateComment, useReplyToComment, useUpdateCourseAbout } from 'features/Course/model/services/course_queries';
import { useCreateAnswer } from './courseMutations';




export const courseQueries = {
  //----------GET QUERIES------------
  allCourses: () =>
    queryOptions({
      queryKey: ['course'],
      queryFn: () => getCoursesOfProfessor(),
    }),
    allTasks: (id: string | null) =>
      queryOptions({
        queryKey: ['course','course-theme',id],
        queryFn: () => getCourseAllTasks(id as string),
        enabled: !!id,
      }),
    courseAbout: (id: string | null) =>
      queryOptions({
        queryKey: ['course','course-theme',id],
        queryFn: () => getCourseAbout(id as string),
        enabled: !!id,
      }),
    allTaskMaterials: (id: string | null) =>
        queryOptions({
          queryKey: ['course','course-details'],
          queryFn: () => getTaskMaterials(id as string),
          enabled: !!id,
        }),
    allAnswerTask: (id: string | null) =>
          queryOptions({
            queryKey: ['answer-task'],
            queryFn: () => getAnswerTask(id as string),
            enabled: !!id,
          }),
    allStudentAnswers: (id: string | null) =>
            queryOptions({
              queryKey: ['student-answer-task'],
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
      // Статистика для студентов
      studentDashboard: () =>
                queryOptions({
                  queryKey: ['statistics', 'student', 'dashboard'],
                  queryFn: () => getStudentDashboard(),
                  staleTime: 5 * 60 * 1000, // 5 минут кэширования (как указано в документации)
                  gcTime: 10 * 60 * 1000, // 10 минут хранения в кэше
                }),
      studentCourseDetail: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['statistics', 'student', 'course', courseId],
                  queryFn: () => getStudentCourseDetail(courseId as string),
                  enabled: !!courseId,
                  staleTime: 1 * 60 * 1000, // 1 минута кэширования (как указано в документации)
                  gcTime: 2 * 60 * 1000, // 2 минуты хранения в кэше
                }),
      // Статистика для учителей
      teacherDashboard: () =>
                queryOptions({
                  queryKey: ['statistics', 'teacher', 'dashboard'],
                  queryFn: () => getTeacherDashboard(),
                  staleTime: 5 * 60 * 1000, // 5 минут кэширования (как указано в документации)
                  gcTime: 10 * 60 * 1000, // 10 минут хранения в кэше
                }),
            teacherCourseDetail: (courseId: string | null) =>
                queryOptions({
                  queryKey: ['statistics', 'teacher', 'course', courseId],
                  queryFn: () => getTeacherCourseDetail(courseId as string),
                  enabled: !!courseId,
                  staleTime: 1 * 60 * 1000, // 1 минута кэширования (как указано в документации)
                  gcTime: 2 * 60 * 1000, // 2 минуты хранения в кэше
                }),
              

                // Mutation hook for updating course about

  
  //----------POST QUERIES------------
      
  create_course: () => useCreateCourse(),
  create_theme: () => useCreateTheme(),
  create_faq: () => useCreateFAQ(),
  create_material: () => useCreateMaterial(),
  create_answer: () => useCreateAnswer(),
  rate_answer: () => useRateAnswerAndComment(),
  finish_course: () => useFinishCourse(),
 

  add_comment: () => useAddComment(),
  reply_comment: () => useReplyToComment(),
  like_comment: () => useRateComment(),


  edit_details: () => useChangeDetails(),
  edit_permission: () => useChangePermission(),

  update_course_about: () => useUpdateCourseAbout(),

  




  deleteCourse: (id: number) => deleteCourse(id),
  delete_material: () => delete_material(),


};
