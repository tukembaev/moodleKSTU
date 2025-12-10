export interface CreateCoursePayload {
    discipline_name: string;
    category: string;
    credit: number;
    control_form: string;

  }

  export interface FinishCourseFormPayload {
    course_id: string;
    status: boolean;
    points?: number;
    reason?: string;
    user_id: number;
  }
  
  
  export interface FinishCoursePayload {
    course_id: string;
    status: boolean;
    user_id: number;
  }
  
  export interface ExtraPointPayload {
    course?: string;
    points?: number;
    reason?: string;
    user_id?:number;
  }

  export interface CreateFAQPayload {
    question: string;
    theme: string;
    answer: string;
  }

  export interface UploadMaterialPayload {
    description: string;
    url: string;
    file: string;
    course_detail: string;
  }
  export interface UploadAnswerPayload {
    task: string;      // Идентификатор курса
    list_files?: File[];        // Массив файлов, если отправляются через форму
  }

  export interface editDetailPayload {
    audience?: boolean;
    requirements?: number[];
    description?: string[];
  }


  export interface editPermissionPayload {
    locked: boolean;
    users?: number[];
    groups?: string[];
  }


  
  export interface RateAnswerPayload {
    points?: number;
    comment?: string;
    answer: string;
  }
  export interface CreateThemePayload {
      course: string;
      title: string;
      type_less: string;
      max_points: number;
      deadline: string;

      locked: boolean;
      open_date: string;
      description: string;
  }
  