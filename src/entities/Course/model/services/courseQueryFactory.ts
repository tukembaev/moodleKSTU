import { queryOptions } from '@tanstack/react-query';

import { deleteCourse, getAnswerTask, getCourseAllTasks, getCoursesOfProfessor, getCourseTablePerfomance, getStudentAnswers, getTaskMaterials, getThemeDiscussion, getThemeFAQ, getCourseModules, getWeekThemes } from './courseAPI';

import { delete_material, useAddComment, useChangeDetails, useChangePermission, useCreateAnswer, useCreateCourse, useCreateFAQ, useCreateMaterial, useCreateTheme, useFinishCourse, useRateAnswerAndComment, useRateComment, useReplyToComment } from 'features/Course/model/services/course_queries';




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


  




  deleteCourse: (id: number) => deleteCourse(id),
  delete_material: () => delete_material(),


};
