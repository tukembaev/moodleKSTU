import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavoriteSubject, deleteFavoriteSubject } from "entities/User";
import { editUserDetails } from "entities/User/model/userAPI";
import { toast } from "sonner";
import i18n from "shared/config/i18n/i18n";
import { FavoritePayload } from "../types/user_payload";



export const UseEditProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({id , data} : {id:number, data: FormData}) => {
      const mutationPromise = editUserDetails(id,data);
      toast.promise(mutationPromise, {
        loading: i18n.t("Редактируем профиль..."),
        success: i18n.t("Профиль успешно отредактирован!"),
        // error: "Ошибка при редактировании профиля. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) =>{
      toast.error(i18n.t("Ошибка: {{message}}", { message: error?.message || i18n.t("Что-то пошло не так") }));

      console.log(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user_info'],exact:false})

    },
  })
}


export const make_favorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FavoritePayload) => {
      const mutationPromise = createFavoriteSubject(data);
      toast.promise(mutationPromise, {
        loading: data.course
          ? i18n.t("Добавляем курс в избранное...")
          : i18n.t("Добавляем урок в избранное..."),
        success: data.course
          ? i18n.t("Курс успешно добавлен в избранное!")
          : i18n.t("Урок успешно добавлен в избранное!"),
        // error: "Ошибка при добавлении в избранное. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) =>{
      toast.error(i18n.t("Ошибка: {{message}}", { message: error?.message || i18n.t("Что-то пошло не так") }));

      console.log(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['course','course-theme'] });
    },
  })
}
export const delete_favorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: "course" | "theme" }) => {
      const mutationPromise = deleteFavoriteSubject({ id, type });
      toast.promise(mutationPromise, {
        loading: type === "course"
          ? i18n.t("Удаляем курс из избранного...")
          : i18n.t("Удаляем урок из избранного..."),
        success: type === "course"
          ? i18n.t("Курс успешно удален из избранного!")
          : i18n.t("Урок успешно удален из избранного!"),
        // error: "Ошибка при удалении из избранного. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: error?.message || i18n.t("Что-то пошло не так") }));

      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["course", "course-theme"] });
    },
  });
};

  
  
