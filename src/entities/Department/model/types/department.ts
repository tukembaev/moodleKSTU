export type Department = {
  id: string;
  name: string;
  teachers_count: number;
  courses_count: number;
  files_count: number;
};

export type DepartmentTeacher = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  position: string | null;
  avatar: string | null;
  courses_count: number;
  files_count: number;
};

export type DepartmentThemeType =
  | "lb"
  | "pr"
  | "lc"
  | "srs"
  | "rgz"
  | "rgr"
  | "umk"
  | "gl"
  | "sb"
  | "test"
  | "other";

export type DepartmentCourseTypeStat = {
  type: DepartmentThemeType | string;
  short_label: string;
  label: string;
  themes_count: number;
  files_count: number;
};

export type DepartmentTeacherCourse = {
  id: string;
  discipline_name: string;
  category: string | null;
  files_count: number;
  by_type: DepartmentCourseTypeStat[];
};
