import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavoriteSubject, deleteFavoriteSubject } from "entities/User";
import { editUserDetails } from "entities/User/model/userAPI";
import { toast } from "sonner";
import { FavoritePayload } from "../types/user_payload";



export const UseEditProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({id , data} : {id:number, data: FormData}) => {
      const mutationPromise = editUserDetails(id,data);
      toast.promise(mutationPromise, {
        loading: `Редактируем профиль...`,
        success: `Профиль успешно отредактирован!`,
        // error: "Ошибка при редактировании профиля. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) =>{
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

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
        loading: `Добавляем ${data.course ? 'курс' : 'урок'} в избранное...`,
        success: `${data.course ? 'Курс' : 'Урок'} успешно добавлен в избранное!`,
        // error: "Ошибка при добавлении в избранное. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) =>{
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

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
        loading: `Удаляем ${type === "course" ? "курс" : "урок"} из избранного...`,
        success: `${type === "course" ? "Курс" : "Урок"} успешно удален из избранного!`,
        // error: "Ошибка при удалении из избранного. Попробуйте снова.",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["course", "course-theme"] });
    },
  });
};

  
  