import { Test } from "entities/Test/model/types/test";

export type CourseOwner = {
  id: string;
  user_id: number;
  user_uuid: string;
  owner_name: string;
  main: boolean;
  avatar: string;
  position: string;
  course: string;
  bio: string;
  review: {
    count_courses: number;
    count_reviews: number;
    rate: number;
  }
  owner: string;
};
export interface CourseDetail {
  id: string;
  course: string;
  title: string;
  deadline: Date;
  max_points: number;

  status: boolean;
  result: number
  comment?: string | null;
  locked: boolean;
  is_favorite: boolean;
  discipline_name: string
  description: string;
}
export interface ThemeFaq {
  id: string,
  question: string,
  theme: string,
  answer: string
}

export type FeedItem = {
  id: string;
  user: {
    user_id: number;
    name: string;
    avatar: string;
  };
  theme: string;
  text: string;
  created_at: Date;
  replies?: FeedItem[];
  likes?: number;

};

export interface CourseProgress {
  success: 0,
  success_pr: 0,
  failure: 0,
  failure_pr: 0
}
export interface CourseLessonsStatusCounter {
  lb_done: 0,
  lb_left: 0,
  pr_done: 0,
  pr_left: 0
}
export interface AdditionalCoursePoints {
  id: string,
  course: 0,
  points: 0,
  reason: 0
}
export interface CourseThemesTypes {
  lb: CourseDetail[];
  srs: CourseDetail[];
  pr: CourseDetail[];
  lc: CourseDetail[];
  test?: Test[];
  other: CourseDetail[];
}

export type Course = {
  id: string;
  icon?: string;
  title: string;
  discipline: string;
  discipline_name: string;
  category: string;
  category_icon: string
  organization_id?: string;
  organization_name?: string;
  is_end: boolean;
  archive?: boolean | null;
  additional_points: AdditionalCoursePoints[]
  course_owner: CourseOwner[];

  count_lb_pr: CourseLessonsStatusCounter;
  progress: CourseProgress;
  course_points: number;
  max_points: number;
  count_stud?: number;
  is_favorite: boolean;
  can_delete?: boolean;
};

export const isCourseArchived = (
  course?: { archive?: boolean | null } | null
) => course?.archive === true;

export const courseHasStudents = (countStud?: number | null) =>
  typeof countStud === "number" && countStud > 0;

/** Кнопка удаления: только архив. `can_delete: false` скрывает, иначе преподаватель может удалять. */
export const canShowDeleteCourse = (
  course?: { archive?: boolean | null; can_delete?: boolean } | null,
  isTeacher = false,
  forceArchived = false
) => {
  if (!isTeacher) return false;
  if (!(forceArchived || isCourseArchived(course))) return false;
  return course?.can_delete !== false;
};


export interface CourseThemes {
  id: string;
  discipline: string;
  discipline_name: string;
  organization_id?: string;
  organization_name?: string;
  archive?: boolean | null;

  courses_hours_left: number;
  max_points: number;
  theme_points: number;
  count_stud?: number;
  can_delete?: boolean;
  icon: string | null;
  course_owner: CourseOwner[];
  detail: CourseThemesTypes;
  requirements: string;
  description: string;
  audience: string;

}

export interface CourseMaterials {
  id: string,
  file: string,
  file_name: string,
  description: string,
  url: string,
  url_name: string,
  course_detail: string,
  files: string
}

export interface CourseAllMaterials {
  id: string;
  discipline_name: string;
  category: string;
  category_icon: string;
  organization_id?: string;
  organization_name?: string;
  is_favorite: boolean;
  audience: string;
  requirements: string;
  description: string;
  archive?: boolean | null;
  count_lb_pr: CourseLessonsStatusCounter;
  progress: CourseProgress;
  course_points: number;
  count_stud?: number;
  can_delete?: boolean;
  is_end: boolean;
  course_owner: CourseOwner[];
  additional_points: AdditionalCoursePoints[];
  detail: Array<{
    id: string;
    week: string;
    title: string;
    type_less: string;
    max_points: number;
    deadline: string;
    status: boolean;
    locked: boolean;
    open_date: string;
    opening_date?: string | number | null;
    description: string;
    discipline_name: string;
    is_favorite: boolean;
    result: string;
    comment?: string | null;
    active_remarks_count: number;
    created_at?: string;
    updated_at?: string;
  }>;
}
export interface FileAnswer {
  id: string;
  file: string;
  file_names: string;
  created_at: string;
  is_read: {
    is_read: boolean;
    read: string | null ;
  };
  submission_id?: string | null;
  version?: number | null;
  is_current?: boolean;
  can_resubmit?: boolean;
  can_delete?: boolean;
}

export interface TaskSubmission {
  id: string;
  version: number;
  is_current: boolean;
  created_at: string;
  files: FileAnswer[];
}

export interface CourseStudentGroup {
  id: string;
  course_id: string;
  name: string;
  color: string | null;
  user_ids: number[];
}

export interface StudentsAnswers {
  id: string ;
  first_name: string;
  last_name: string;
  middle_name: string;
  avatar: string;
  role: string;
  position: string;
  email: string;
  bio: string;
  number_phone: string;
  telegram_username: string;
  group: string;
  group_by?: string[];
  fullname: string;
  locked: boolean;
  task: string;
  max_points: number;
  created_at: string;
  user_id: number;
  course_id?: string;
  status: string;
  points: number;
  comment?: string | null;
  remarks: number;
  pending_remarks: number;
  responded_remarks?: number;
  files: FileAnswer[];
  submissions?: TaskSubmission[];
  can_resubmit?: boolean;
  current_version?: number | null;
}
export interface ThemeItem {
  id: string;
  title: string;
  max_points: number;
  id_answer_task?: string | null;
  stud_points?: number | null;
  comment?: string | null;
}

export interface TestItem {
  id: string;
  title: string;
  max_points: number;
  id_result: string | null;
  result: number;
  comment?: string | null;
}

export interface ModuleThemes {
  pr: ThemeItem[];
  lb: ThemeItem[];
  srs: ThemeItem[];
  other: ThemeItem[];
}

export interface CourseModule {
  module_id: string;
  title: string;
  thems: ModuleThemes;
}

export interface StudentTheme {
  id: string; // UUID формат
  title: string;
  max_points: number;
  id_answer_task: string | null;
  stud_points: number | null;
  comment?: string | null;
  due_date: string | null; // Обычно ISO дата или null
}
export interface TablePerfomance {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  avatar: string | null;
  role: string;
  position: string | null;
  email: string;
  bio: string | null;
  number_phone: string | null;
  telegram_username: string | null;
  group: string | null;
  group_by?: string[];
  is_end: boolean;
  max_points_course: number;
  themes: StudentTheme[];
  
}


export interface Week {
  id: string;
  module: string;
  title: string;
}

export interface Module {
  id: string;
  title: string;
  weeks: Week[];
}

export interface WeekTheme {
  id: string;
  week: string;
  title: string;
  type_less: string;
  max_points: number;
  deadline: string;
  status: boolean;
  locked: boolean;
  open_date: string;
  description: string;
  discipline_name: string;
  is_favorite: boolean;
  result: string;
  comment?: string | null;
}

export interface CourseModulesResponse {
  id: string;
  discipline_name: string;
  category: string;
  category_icon: string;
  audience: string;
  requirements: string;
  description: string;
  archive?: boolean | null;
  count_stud?: number;
  can_delete?: boolean;
  course_owner: CourseOwner[];
  modules: Module[];
}

export interface StudyTask {
  id: string;
  week: string;
  title: string;
  type_less: string;
  max_points: number;
  deadline: string | null;
  status: boolean | null;
  locked: boolean;
  open_date: string | null;
  description: string | null;
  discipline_name: string;
  is_favorite: boolean;
  result: number | null;
}

export interface CourseStream {
  id: string;
  course: string;
  stream_id: string;
  title: string;
}

export interface CourseInviteLink {
  link: string;
  course_id?: string;
  link_id?: string;
}

export interface RegisterToCoursePayload {
  course_id: string;
  link_id: string;
}

export interface CreateCourseInvitePayload {
  course_id: string;
  /** ISO 8601 Duration (`P1D`, `P7D`, …) или `null` для открытого всегда приглашения */
  duration: string | null;
}

export type SubmissionStatus = "submitted" | "not_submitted" | "overdue";

export type MySubmissionItem = {
  theme_id: string;
  title: string;
  type_less: string;
  week: number | null;
  deadline: string | null;
  status: SubmissionStatus;
  points: number | null;
  max_points: number;
  comment: string | null;
  current_version: number | null;
  submission_id: string | null;
  task_file_id: string | null;
  submitted_at: string | null;
};

export type CourseExtraPoint = {
  id: string;
  course: string;
  points: number;
  reason: string;
};

export type MySubmissionsResponse = {
  course_id: string;
  discipline_name: string;
  extra_points: CourseExtraPoint[];
  results: MySubmissionItem[];
};

export type CourseMaterialFile = {
  id: string;
  file_name: string;
  file: string;
  file_id: string;
  theme: { id: string; title: string };
  uploaded_at: string;
};

export type AnnouncementAuthor = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  middle_name: string | null;
  avatar: string | null;
  full_name: string;
};

export type CourseAnnouncement = {
  id: string;
  course_id: string;
  author: AnnouncementAuthor;
  text: string;
  is_pinned: boolean;
  can_manage: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateAnnouncementPayload = {
  text: string;
  is_pinned?: boolean;
};

export type UpdateAnnouncementPayload = Partial<{
  text: string;
  is_pinned: boolean;
}>;

export type CourseFeedKind =
  | "announcement"
  | "material_created"
  | "material_updated"
  | "material_replaced"
  | "material_deleted";

export type CourseFeedMaterial = {
  id?: string | null;
  file_name: string;
  previous_file_name?: string | null;
  file?: string | null;
  theme?: { id: string; title: string } | null;
};

export type CourseFeedItem = {
  id: string;
  kind: CourseFeedKind;
  created_at: string;
  updated_at?: string | null;
  author?: AnnouncementAuthor | null;
  is_pinned?: boolean;
  can_manage?: boolean;
  text?: string | null;
  material?: CourseFeedMaterial | null;
  announcement?: CourseAnnouncement | null;
};

export type CourseFeedKindFilter = "all" | "announcement" | "materials";

export type CourseFeedQuery = {
  sort?: "desc" | "asc";
  kind?: CourseFeedKindFilter;
};
