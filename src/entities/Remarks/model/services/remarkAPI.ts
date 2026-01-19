import $api_base_edu from "shared/api/api_base_edu";
import { Remark, RemarkStatus } from "../types/remarks";

// Типы для API
export interface CreateRemarkPayload {
  theme_id: string;
  student_id: number;
  title?: string;
  message: string;
}

export interface UpdateRemarkStatusPayload {
  status: RemarkStatus;
}

export interface AddRemarkMessagePayload {
  message: string;
}

export type RemarkListType = "actual" | "archive";

// GET /api/v1/remarks/?type=actual|archive
export const getRemarks = async (type: RemarkListType = "actual"): Promise<Remark[]> => {
  const response = await $api_base_edu.get(`v1/remarks/`, {
    params: { type }
  });
  return response.data;
};

// GET /api/v1/remarks/{id}/
export const getRemarkById = async (id: string): Promise<Remark> => {
  const response = await $api_base_edu.get(`v1/remarks/${id}/`);
  return response.data;
};

// POST /api/v1/remarks/
export const createRemark = async (data: CreateRemarkPayload): Promise<Remark> => {
  const response = await $api_base_edu.post(`v1/remarks/`, data);
  return response.data;
};

// PATCH /api/v1/remarks/{id}/status/
export const updateRemarkStatus = async (
  id: string,
  data: UpdateRemarkStatusPayload
): Promise<Remark> => {
  const response = await $api_base_edu.patch(`v1/remarks/${id}/status/`, data);
  return response.data;
};

// POST /api/v1/remarks/{id}/messages/
export const addRemarkMessage = async (
  id: string,
  data: AddRemarkMessagePayload
): Promise<Remark> => {
  const response = await $api_base_edu.post(`v1/remarks/${id}/messages/`, data);
  return response.data;
};

// GET /api/v1/remarks/theme/{theme_id}/
export const getRemarksByTheme = async (themeId: string): Promise<Remark[]> => {
  const response = await $api_base_edu.get(`v1/remarks/theme/${themeId}/`);
  return response.data;
};

// GET /api/v1/remarks/theme/{theme_id}/student/{student_id}/
export const getRemarksByThemeAndStudent = async (
  themeId: string,
  studentId: number
): Promise<Remark[]> => {
  const response = await $api_base_edu.get(`v1/remarks/theme/${themeId}/student/${studentId}/`);
  return response.data;
};
