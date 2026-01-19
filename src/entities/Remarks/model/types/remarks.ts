// Типы для системы замечаний

export enum RemarkStatus {
  PENDING = "pending",           // Ожидает ответа студента
  RESPONDED = "responded",       // Студент ответил, ожидает проверки
  APPROVED = "approved",         // Одобрено (в архиве)
  REJECTED = "rejected",         // Отклонено, требует исправления
}


export interface RemarkMessage {
  id: string;
  remark_id: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  sender_role: "teacher" | "student";
  message: string;
  created_at: string;
}

export interface Remark {
  id: string;
  course_id: string;
  title: string;
  course_name: string;
  theme_id: string;
  theme_title: string;

  student_id: number;
  student_name: string;
  student_avatar: string;
  student_group: string | null;
  teacher_id: number;
  teacher_name: string;
  teacher_avatar: string;
  status: RemarkStatus;
  messages: RemarkMessage[];
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}
