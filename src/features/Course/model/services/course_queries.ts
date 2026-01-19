import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { registerToCourse } from 'entities/User';

import { createCourse, createTheme } from 'entities/Course';
import { createComment, createFAQ, createMaterial, deleteMaterial, editCourseDetails, editPermissionTheme, finishCourse, getCourseAbout, likeComment, rateTheAnswerAndComment, replyOnComment, setExtraPoints, updateCourseAbout } from 'entities/Course/model/services/courseAPI';
import { toast } from 'sonner';
import { CreateCoursePayload, CreateFAQPayload, CreateThemePayload, editDetailPayload, editPermissionPayload, FinishCourseFormPayload, RateAnswerPayload } from '../types/course_payload';
import { UpdateCourseAboutPayload } from 'entities/Course/model/types/courseAbout';



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
        queryClient.invalidateQueries({ queryKey: ['course','course-details'] });
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
          if (!data.answer) {
            toast.warning("Студент не отвечал на задание, оценивание невозможно");
            return Promise.reject("Нет ID ответа");
          }
          const mutationPromise = rateTheAnswerAndComment(data);
          toast.promise(mutationPromise, {
            loading: "Оцениваем работу...",
            success: "Оценивание работы прошло успешно!",
            // error: "Ошибка при оценивании работы. Попробуйте снова.",
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
        },});
      
    };

    export const useUpdateCourseAbout = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: UpdateCourseAboutPayload }) => {
          const mutationPromise = updateCourseAbout(courseId, data);
          toast.promise(mutationPromise, {
            loading: "Сохраняем изменения...",
            success: "Изменения успешно сохранены!",
          });
          return mutationPromise;
        },
        onError: (error: any) => {
          toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
          console.log(error.message);
        },
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['course-about', variables.courseId] });
        },
      });
    }


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
            queryClient.invalidateQueries({ queryKey: [
              'answer-task'] });
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
      queryClient.invalidateQueries({ queryKey: ['course','course-details'] });
 
    },
  });
};