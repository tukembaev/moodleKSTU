import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerToCourse } from 'entities/User';

import { createCourse, createTheme } from 'entities/Course';
import { apiErrorDetail } from 'entities/Course/lib/apiErrorDetail';
import { bindCourseStreams, createAnswer, createComment, createCourseAnnouncement, createCourseInviteLink, createFAQ, createMaterial, deleteAnswer, deleteCourseAnnouncement, deleteCourseInviteLink, deleteCourseStream, deleteMaterial, deleteTheme, duplicateCourse, editCourseDetails, editPermissionTheme, editTheme, finishCourse, likeComment, rateTheAnswerAndComment, removeStudentFromCourse, replyOnComment, setExtraPoints, themeAttendanceThemeKey, updateCourseAnnouncement, updateThemeAttendance } from 'entities/Course/model/services/courseAPI';
import { CreateAnnouncementPayload, CreateCourseInvitePayload, ThemeAttendance, ThemeAttendanceStudent, UpdateAnnouncementPayload, UpdateThemeAttendancePayload } from 'entities/Course/model/types/course';
import { toast } from 'sonner';
import { BindCourseStreamsPayload, CreateCoursePayload, CreateFAQPayload, CreateThemePayload, EditThemePayload, editDetailPayload, editPermissionPayload, FinishCourseFormPayload, RateAnswerPayload } from '../types/course_payload';

const MY_SUBMISSIONS_QUERY_KEY = ['course', 'my-submissions'] as const;
const COURSE_MATERIALS_QUERY_KEY = ['course', 'course-materials'] as const;
const COURSE_ANNOUNCEMENTS_QUERY_KEY = ['course', 'announcements'] as const;
const COURSE_FEED_QUERY_KEY = ['course', 'feed'] as const;

export const useRegistrateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => {
      const mutationPromise = registerToCourse(courseId);
      toast.promise(mutationPromise, {
        loading: "Регистрируемся на курс...",
        success: "Регистрация на курс прошла успешно!",
        // error: "Ошибка при регистрации. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration'] });
    },
  });
}

  export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateCoursePayload) => {
        const mutationPromise = createCourse(data);
        toast.promise(mutationPromise, {
          loading: "Создаем курс...",
          success: "Создание курса прошло успешно!",
          // error: "Ошибка при создании курса. Попробуйте снова.",
        });
        return mutationPromise;
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

        console.log(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['course'] });

      },
    });
  };

  export const useDuplicateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => {
        const mutationPromise = duplicateCourse(id);
        toast.promise(mutationPromise, {
          loading: "Копируем курс со всеми темами и материалами...",
          success: "Курс успешно продублирован!",
        });
        return mutationPromise;
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Не удалось продублировать курс"}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['course'] });
      },
    });
  };

  export const useCreateFAQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateFAQPayload) => {
        const mutationPromise = createFAQ(data);
        toast.promise(mutationPromise, {
          loading: "Создаем FAQ...",
          success: "Создание FAQ прошло успешно!",
          // error: "Ошибка при создании FAQ. Попробуйте снова.",
        });
        return mutationPromise;
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
        console.log(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['faq'] });
      },
    });
  };

  export const useCreateMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: FormData) => {
        const mutationPromise = createMaterial(data);
        toast.promise(mutationPromise, {
          loading: "Загружаем материал...",
          success: "Загрузка материала прошло успешно!",
          // error: "Ошибка при загрузке материала. Попробуйте снова.",
        });
        return mutationPromise;
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

        console.log(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['course','task-materials'], exact: false });
        queryClient.invalidateQueries({ queryKey: COURSE_MATERIALS_QUERY_KEY, exact: false });
        queryClient.invalidateQueries({ queryKey: COURSE_FEED_QUERY_KEY, exact: false });
      },
    });
  };

  export const useCreateAnswer = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: FormData) => {
        const mutationPromise = createAnswer(data);
        toast.promise(mutationPromise, {
          loading: "Загружаем вашу работу...",
          success: "Загрузка работы прошла успешно!",
          error: (error) => apiErrorDetail(error, "Не удалось загрузить работу"),
        });
        return mutationPromise;
      },
      onError: (error) => {
        console.log(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['student-answer-task'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['answer-task'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['remarks'], exact: false });
        queryClient.invalidateQueries({ queryKey: MY_SUBMISSIONS_QUERY_KEY, exact: false });
      },
    });
  };
    export const useCreateTheme = () =>{
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateThemePayload) => {
        const mutationPromise = createTheme(data);
        toast.promise(mutationPromise, {
          loading: "Создаем тему...",
          success: "Создание темы прошло успешно!",
          // error: "Ошибка при создании темы. Попробуйте снова.",
        });
        return mutationPromise;
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

        console.log(error.message);
      },
      onSuccess: () => {

        queryClient.invalidateQueries({ queryKey: ['course','course-theme'] });
      },
    });
    }

    export const useRateAnswerAndComment = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (data: RateAnswerPayload) => {
          if (!data.answer && !data.result) {
            toast.warning("Студент не отвечал на задание, оценивание невозможно");
            return Promise.reject("Нет ID ответа");
          }
          const mutationPromise = rateTheAnswerAndComment(data);
          toast.promise(mutationPromise, {
            loading: "Оцениваем работу...",
            success: "Оценивание работы прошло успешно!",
          });
          return mutationPromise;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['table-perfomance'],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: ['answer-task'],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: ['student-answer-task'],
            exact: false,
          });
          queryClient.invalidateQueries({ queryKey: ['course', 'course-all-themes'] });
          queryClient.invalidateQueries({ queryKey: ['course', 'course-theme'] });
          queryClient.invalidateQueries({ queryKey: ['course', 'tests'] });
          queryClient.invalidateQueries({ queryKey: ['test'] });
          queryClient.invalidateQueries({ queryKey: ['statistics'], exact: false });
          queryClient.invalidateQueries({ queryKey: MY_SUBMISSIONS_QUERY_KEY, exact: false });
        },});
      
    };

      export const useChangePermission = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ id, data }: { id: string; data: editPermissionPayload }) => {
            const mutationPromise = editPermissionTheme(id,data);
            toast.promise(mutationPromise, {
              loading: "Меняем доступ...",
              success: "Изменение доступа прошло успешно!",
              // error: "Ошибка при изменении доступа. Попробуйте снова.",
            });
            return mutationPromise;
          },
          onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

            console.log(error.message);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course','course-theme'] });
            queryClient.invalidateQueries({ queryKey: ['course', 'course-all-themes'], exact: false });
            queryClient.invalidateQueries({ queryKey: [
              'answer-task'] });
          },
        });
      };

      export const useSetThemeAccessForAll = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({
            id,
            locked,
            users,
          }: {
            id: string;
            locked: boolean;
            users: number[];
          }) => {
            const mutationPromise = Promise.all([
              users.length > 0
                ? editPermissionTheme(id, { locked, users })
                : Promise.resolve(),
              editTheme(id, { locked }),
            ]);
            toast.promise(mutationPromise, {
              loading: locked
                ? "Закрываем доступ всем..."
                : "Открываем доступ всем...",
              success: locked
                ? "Доступ закрыт для всех студентов"
                : "Доступ открыт для всех студентов",
            });
            return mutationPromise;
          },
          onError: (error) => {
            toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', 'course-all-themes'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['course', 'course-theme'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['answer-task'] });
          },
        });
      };

      export const useEditTheme = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ id, data }: { id: string; data: EditThemePayload }) => {
            const mutationPromise = editTheme(id, data);
            toast.promise(mutationPromise, {
              loading: "Сохраняем тему...",
              success: "Тема успешно изменена!",
            });
            return mutationPromise;
          },
          onError: (error) => {
            toast.error(`Ошибка: ${error?.message || "Не удалось изменить тему"}`);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', 'course-all-themes'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['course', 'course-theme'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['week', 'themes'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['course', 'task-materials'], exact: false });
            queryClient.invalidateQueries({ queryKey: COURSE_MATERIALS_QUERY_KEY, exact: false });
          },
        });
      };

      export const useDeleteTheme = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: (id: string) => {
            const mutationPromise = deleteTheme(id);
            toast.promise(mutationPromise, {
              loading: "Удаляем тему...",
              success: "Тема успешно удалена!",
            });
            return mutationPromise;
          },
          onError: (error) => {
            toast.error(`Ошибка: ${error?.message || "Не удалось удалить тему"}`);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', 'course-all-themes'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['course', 'course-theme'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['week', 'themes'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['course', 'task-materials'], exact: false });
            queryClient.invalidateQueries({ queryKey: COURSE_MATERIALS_QUERY_KEY, exact: false });
          },
        });
      };

      export const useChangeDetails = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ id, data }: { id: string; data: editDetailPayload }) => {
            const mutationPromise = editCourseDetails(id,data);
            toast.promise(mutationPromise, {
              loading: "Меняем детали курса...",
              success: "Изменение информации о курсе прошло успешно!",
              // error: "Ошибка при изменении информации о курсе. Попробуйте снова.",
            });
            return mutationPromise;
          },
          onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

            console.log(error.message);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course','course-theme'] });
            queryClient.invalidateQueries({ queryKey: ['course','course-all-themes'] });
            queryClient.invalidateQueries({ queryKey: ['course'], exact: true });
          },
        });
      };


      export const useFinishCourse = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: (data: FinishCourseFormPayload) => {
            debugger
            const mutationPromise = finishCourse({
              course_id:data.course_id,
              status:data.status,
              user_id:data.user_id
            });
            setExtraPoints({
              course:data.course_id,
              points:data.points,
              reason:data.reason,
              user_id:data.user_id
            })
            toast.promise(mutationPromise, {
              loading: "Выставляем итоговый балл для студента...",
              success: "Итоговый балл выставлен!",
              // error: "Ошибка при выставлении итога. Попробуйте снова.",
            });
            return mutationPromise;
          },
          onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

            console.log(error.message);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course'] });
            queryClient.invalidateQueries({ queryKey: ['table-perfomance'],exact:false });
          },
        });
      };
     

      export const useAddComment = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ theme, text }: { theme: string; text: string }) => {
            const mutationPromise = createComment(theme,text);
            toast.promise(mutationPromise, {
              loading: "Отправляем ваш комментарий...",
              success: "Отправка комментария прошла успешно!",
              // error: "Ошибка при отправке комментария. Попробуйте снова.",
            });
            return mutationPromise;
          },
          onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

            console.log(error.message);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discussion'],exact:false  });
          },
        });
      };


      export const useReplyToComment = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ comment_id, text }: { comment_id: string; text: string }) => {
            const mutationPromise = replyOnComment(comment_id,text);
            toast.promise(mutationPromise, {
              loading: "Отвечаем на комментарий...",
              success: "Отправка комментария прошла успешно!",
              // error: "Ошибка при отправке комментария. Попробуйте снова.",
            });
            return mutationPromise;
          },
          onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

            console.log(error.message);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discussion'],exact:false  });
          },
        });
      };

      
      export const useRateComment = () => {
        const queryClient = useQueryClient();
        return useMutation({
          mutationFn: ({ comment_id }: { comment_id: string }) => {
            const mutationPromise = likeComment(comment_id);
            return mutationPromise;
          },
          onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

            console.log(error.message);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discussion'],exact:false  });
          },
        });
      };

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const mutationPromise = deleteAnswer(id);
      toast.promise(mutationPromise, {
        loading: "Удаляем файл...",
        success: "Файл успешно удалён!",
        error: (error) => apiErrorDetail(error, "Не удалось удалить файл"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-answer-task'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['answer-task'], exact: false });
      queryClient.invalidateQueries({ queryKey: MY_SUBMISSIONS_QUERY_KEY, exact: false });
    },
  });
};

export const delete_material = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id:string) => {
      const mutationPromise = deleteMaterial(id);
      toast.promise(mutationPromise, {
        loading: `Удаляем материал...`,
        success: `Материал успешно удален!`,
        // error: "Ошибка при удалении из избранного. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course','task-materials'], exact: false });
      queryClient.invalidateQueries({ queryKey: COURSE_MATERIALS_QUERY_KEY, exact: false });
      queryClient.invalidateQueries({ queryKey: COURSE_FEED_QUERY_KEY, exact: false });
 
    },
  });
};

export const useBindCourseStreams = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BindCourseStreamsPayload) => {
      const mutationPromise = bindCourseStreams(data);
      toast.promise(mutationPromise, {
        loading: "Привязываем потоки к курсу...",
        success: "Потоки успешно привязаны к курсу!",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось привязать потоки"}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', 'streams'], exact: false });
    },
  });
};

export const useRemoveStudentFromCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      studentId,
    }: {
      courseId: string;
      studentId: number;
    }) => {
      const mutationPromise = removeStudentFromCourse(courseId, studentId);
      toast.promise(mutationPromise, {
        loading: "Удаляем студента с курса...",
        success: "Студент удалён с курса",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось удалить студента"}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answer-task"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["table-perfomance"],
        exact: false,
      });
    },
  });
};

export const useDeleteCourseStream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const mutationPromise = deleteCourseStream(id);
      toast.promise(mutationPromise, {
        loading: "Отвязываем поток от курса...",
        success: "Поток успешно отвязан от курса!",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось отвязать поток"}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', 'streams'], exact: false });
    },
  });
};

export const useCreateCourseInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseInvitePayload) => {
      const mutationPromise = createCourseInviteLink(data);
      toast.promise(mutationPromise, {
        loading: "Создаём приглашение...",
        success: "Приглашение на курс создано",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось создать приглашение"}`);
    },
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData(['course', 'invite-link', variables.course_id], data);
      } else {
        queryClient.invalidateQueries({
          queryKey: ['course', 'invite-link', variables.course_id],
        });
      }
    },
  });
};

export const useDeleteCourseInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => {
      const mutationPromise = deleteCourseInviteLink(courseId);
      toast.promise(mutationPromise, {
        loading: "Удаляем приглашение...",
        success: "Приглашение удалено",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось удалить приглашение"}`);
    },
    onSuccess: (_data, courseId) => {
      queryClient.setQueryData(['course', 'invite-link', courseId], null);
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      ...payload
    }: CreateAnnouncementPayload & { courseId: string }) => {
      const mutationPromise = createCourseAnnouncement(courseId, payload);
      toast.promise(mutationPromise, {
        loading: "Публикуем объявление...",
        success: "Объявление опубликовано",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${apiErrorDetail(error, "Не удалось опубликовать объявление")}`);
    },
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: [...COURSE_ANNOUNCEMENTS_QUERY_KEY, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [...COURSE_FEED_QUERY_KEY, courseId],
      });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      announcementId,
      ...payload
    }: UpdateAnnouncementPayload & { courseId: string; announcementId: string }) => {
      const mutationPromise = updateCourseAnnouncement(
        courseId,
        announcementId,
        payload
      );
      toast.promise(mutationPromise, {
        loading: "Сохраняем объявление...",
        success: "Объявление обновлено",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${apiErrorDetail(error, "Не удалось обновить объявление")}`);
    },
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: [...COURSE_ANNOUNCEMENTS_QUERY_KEY, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [...COURSE_FEED_QUERY_KEY, courseId],
      });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      announcementId,
    }: {
      courseId: string;
      announcementId: string;
    }) => {
      const mutationPromise = deleteCourseAnnouncement(courseId, announcementId);
      toast.promise(mutationPromise, {
        loading: "Удаляем объявление...",
        success: "Объявление удалено",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${apiErrorDetail(error, "Не удалось удалить объявление")}`);
    },
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: [...COURSE_ANNOUNCEMENTS_QUERY_KEY, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [...COURSE_FEED_QUERY_KEY, courseId],
      });
    },
  });
};

function patchAttendanceStudent(
  current: ThemeAttendance | undefined,
  row: ThemeAttendanceStudent
): ThemeAttendance | undefined {
  if (!current) return current;
  return {
    ...current,
    students: current.students.map((student) =>
      student.student_id === row.student_id ? { ...student, ...row } : student
    ),
  };
}

export const useUpdateThemeAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      themeId,
      data,
    }: {
      themeId: string;
      data: UpdateThemeAttendancePayload;
    }) => updateThemeAttendance(themeId, data),
    onError: (error) => {
      toast.error(
        `Ошибка: ${apiErrorDetail(error, "Не удалось сохранить посещаемость")}`
      );
    },
    onSuccess: (row, { themeId }) => {
      queryClient.setQueriesData<ThemeAttendance>(
        { queryKey: themeAttendanceThemeKey(themeId) },
        (current) => patchAttendanceStudent(current, row)
      );
    },
  });
};