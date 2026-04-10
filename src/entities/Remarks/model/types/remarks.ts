// Типы для системы замечаний

export enum RemarkStatus {
  PENDING = "pending",           // Ожидает ответа студента
  RESPONDED = "responded",       // Студент ответил, ожидает проверки
  APPROVED = "approved",         // Одобрено (в архиве)
  REJECTED = "rejected",         // Отклонено, требует исправления
}

export enum RemarkType {
  TEXT = "text",                 // Текстовое замечание
  FILE = "file",                 // Замечание к файлу
}

export interface RemarkAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: Date;
}

export interface RemarkMessage {
  id: string;
  remark_id: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  sender_role: "teacher" | "student";
  message: string;
  attachments: RemarkAttachment[];
  created_at: Date;
}

export interface Remark {
  id: string;
  course_id: string;
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
  type: RemarkType;
  status: RemarkStatus;
  original_file?: RemarkAttachment;  // Файл, к которому было замечание (для FILE типа)
  messages: RemarkMessage[];
  created_at: Date;
  updated_at: Date;
  archived_at?: Date;
}

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
