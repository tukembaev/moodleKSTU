// Типы для системы замечаний (подогнаны под API /api/v1/remarks/)

export enum RemarkStatus {
  PENDING = "pending",           // Ожидает ответа студента
  RESPONDED = "responded",       // Студент ответил, ожидает проверки
  APPROVED = "approved",         // Одобрено (в архиве)
  REJECTED = "rejected",         // Отклонено, требует исправления
}

// Оставлено для совместимости UI (не приходит с API)
export enum RemarkType {
  TEXT = "text",
  FILE = "file",
}

export interface RemarkAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: Date | string;
}

export interface RemarkMessage {
  id: string;
  remark_id: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  sender_role: "teacher" | "student";
  message: string;
  created_at: Date | string;
  // UI-only, на API отсутствует
  attachments?: RemarkAttachment[];
}

export interface Remark {
  id: string;
  course_id: string;
  title?: string;
  course_name: string;
  theme_id: string;
  theme_title: string;
  student_id: number;
  student_name: string;
  student_avatar: string;
  student_group: string;
  teacher_id: number;
  teacher_name: string;
  teacher_avatar: string;
  status: RemarkStatus;
  messages: RemarkMessage[];
  messages_count?: string | number;
  last_message?: string;
  created_at: Date | string;
  updated_at: Date | string;
  archived_at?: Date | string | null;
  pending_remarks:number;
  // UI-only поля (не приходят с API)
  type?: RemarkType;
  original_file?: RemarkAttachment;
}

// Тип замечаний для фильтрации на /api/v1/remarks/
export type RemarksListType = "actual" | "archive";

// ---- Payloads ----

export interface CreateRemarkPayload {
  theme_id: string;
  student_id: number;
  title: string;
  message: string;
}

export interface AddRemarkMessagePayload {
  message: string;
}

export interface UpdateRemarkStatusPayload {
  status: RemarkStatus;
}

// ---- Вспомогательные ----

export interface StudentRemarkSummary {
  student_id: number;
  student_name: string;
  student_avatar: string;
  student_group: string;
  total_remarks: number;
  pending_remarks: number;
  responded_remarks: number;
  courses: {
    course_id: string;
    course_name: string;
    remarks_count: number;
  }[];
}

export interface ArchivedRemarksBySubject {
  course_id: string;
  course_name: string;
  remarks: Remark[];
}
