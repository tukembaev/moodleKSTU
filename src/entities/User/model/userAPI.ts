import { Course } from "entities/Course";
import { FavoritePayload } from "features/User";
import $api_edu from "shared/api/api_edu";
import $api_users from "shared/api/api_users";
import { AchievementList, Favorites, Notification, UserFilesList, UserGroupList, UserProfileData } from "../types/user";


export const getUserInfo = async (id: number | null): Promise<UserProfileData> => {
  const response = await $api_users.get(`user/${id}/`)
  return response.data
};

export const getUserFiles = async (id: number | null): Promise<UserFilesList[]> => {
  const response = await $api_users.get(`files/${id}/`)
  return response.data
};

export const getUserTeam = async (group: string | null): Promise<UserGroupList[]> => {
  const response = await $api_users.get(`my-team/${group}/`)
  return response.data
};

export const getRegistrationList = async (): Promise<Course[]> => {
  const response = await $api_edu.get(`list-course-register/`);
  return response.data;
};

export const registerToCourse = async (courseId: string) => {
  const response = await $api_users.post(`registration-course/`, {
    course_id: courseId,
  });
  return response.data;
};

export const getUserAchievements = async (): Promise<AchievementList> => {
  const response = await $api_users.get('api/v1/achievements/')
  return response.data
};

import $api_notification from "shared/api/api_notification";

export const getUserNotifications = async (): Promise<Notification[]> => {
  const response = await $api_notification.get("notifications/");
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  const response = await $api_notification.patch(`notifications/${id}/`, { status: true });
  return response.data;
};

export const getUserFavorites = async (): Promise<Favorites> => {
  const response = await $api_users.get('favorites/')
  return response.data
};

export const createFavoriteSubject = async (data: FavoritePayload) => {
  const response = await $api_users.post(`favorites/`, data);
  return response.data;
};

export const editUserDetails = async (id: number | null, data: any) => {
  const response = await $api_users.patch(`user/${id}/`, data);
  return response.data;
};

export const deleteFavoriteSubject = async ({ id, type }: { id: string; type: "course" | "theme" }) => {
  const response = await $api_users.delete(`favorites/?type=${type}&id=${id}`);
  return response.data;
};

