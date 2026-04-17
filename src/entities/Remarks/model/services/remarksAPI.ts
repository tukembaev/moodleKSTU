import $api_base_edu from "shared/api/api_base_edu";
import {
  AddRemarkMessagePayload,
  CreateRemarkPayload,
  Remark,
  RemarkMessage,
  RemarksListType,
  UpdateRemarkStatusPayload,
} from "../types/remarks";

// 1. Список замечаний пользователя (actual / archive)
export const getRemarks = async (
  type: RemarksListType = "actual"
): Promise<Remark[]> => {
  const response = await $api_base_edu.get(`v1/remarks/`, {
    params: { type },
  });
  return response.data;
};

// 2. Создать замечание (обычно учителем)
export const createRemark = async (
  data: CreateRemarkPayload
): Promise<Remark> => {
  const response = await $api_base_edu.post(`v1/remarks/`, data);
  return response.data;
};

// 3. Детали замечания
export const getRemarkById = async (id: string): Promise<Remark> => {
  const response = await $api_base_edu.get(`v1/remarks/${id}/`);
  return response.data;
};

// 4. Добавить сообщение в существующее замечание
export const addRemarkMessage = async (
  id: string,
  data: AddRemarkMessagePayload
): Promise<RemarkMessage> => {
  const response = await $api_base_edu.post(
    `v1/remarks/${id}/messages/`,
    data
  );
  return response.data;
};

// 5. Обновить статус замечания
export const updateRemarkStatus = async (
  id: string,
  data: UpdateRemarkStatusPayload
): Promise<Remark> => {
  const response = await $api_base_edu.patch(
    `v1/remarks/${id}/status/`,
    data
  );
  return response.data;
};

// 6. Замечания текущего студента по теме
export const getRemarksByTheme = async (
  theme_id: string
): Promise<Remark[]> => {
  const response = await $api_base_edu.get(`v1/remarks/theme/${theme_id}/`);
  return response.data;
};

// 7. Замечания конкретного студента по теме (для учителя)
export const getRemarksByThemeAndStudent = async (
  theme_id: string,
  student_id: number
): Promise<Remark[]> => {
  const response = await $api_base_edu.get(
    `v1/remarks/theme/${theme_id}/student/${student_id}/`
  );
  return response.data;
};
