import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRegistrationList, getUserAchievements, getUserFavorites, getUserFiles, getUserInfo, getUserNotifications, getUserTeam, markNotificationAsRead } from './userAPI';

import { useRegistrateCourse } from 'features/Course';
import { make_favorite } from 'features/User';
import { delete_favorite, UseEditProfile } from 'features/User/model/services/user_queries';

export const userQueries = {
  all: () => ['users', 'user'],


  user: (id: number) =>
    queryOptions({
      queryKey: ['user_info', id && id],
      queryFn: () => getUserInfo(id as number),
      enabled: Boolean(id),
    }),

  user_file: (id: number) =>
    queryOptions({
      queryKey: ['user_files'],
      queryFn: () => getUserFiles(id as number),
      enabled: Boolean(id),
    }),
  user_team: (group: string) =>
    queryOptions({
      queryKey: ['user_team'],
      queryFn: () => getUserTeam(group),
      enabled: Boolean(group),
    }),
  user_achievements: () =>
    queryOptions({
      queryKey: ['achievements'],
      queryFn: () => getUserAchievements(),
    }),

  user_notifications: () =>
    queryOptions({
      queryKey: ["notifications"],
      queryFn: getUserNotifications,
    }),
  use_mark_notification_read: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => markNotificationAsRead(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },
    });
  },

  user_favorites: () =>
    queryOptions({
      queryKey: ['favorites'],
      queryFn: () => getUserFavorites(),
    }),

  availableRegistrations: () =>
    queryOptions({
      queryKey: ['registration'],
      queryFn: () => getRegistrationList(),
    }),

  // Перенесенные функции
  edit_profile: () => UseEditProfile(),
  registrate: () => useRegistrateCourse(),
  make_favorite,
  delete_favorite,

};
