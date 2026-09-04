import { Course, CourseDetail } from "entities/Course";

export interface Employee {
  id: number;
  employee_id: number;
  inn: string;
  first_name: string;
  last_name: string;
  email_person: string;
  imeag: string; // Если это URL изображения, можно использовать `URL` вместо `string`
  position: string;
  division: string | null;
  number_phone: string;
  date_of_come: string | null;
  date_of_leave: string | null;
  num_prikaz_enter: string;
  rate: number;
  is_active: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  requirements: string;
  complexity: "Regular" | "Rare" | "Mythical" | "Legendary";
  user_status: boolean;
}

export interface AchievementList {
  regular: Achievement[];
  rare: Achievement[];
  mythical: Achievement[];
  legendary: Achievement[];
}

export interface UserEmployment {
  id: string;
  organization_id: string;
  organization_name: string;
  position: string;
  rate: number;
  employment_type: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export interface UsersMeEmployeeProfile {
  is_active: boolean;
  employments: UserEmployment[];
}

export interface UsersMeStudentProfile {
  is_active?: boolean;
  group?: string | null;
  group_name?: string | null;
  faculty?: string | null;
  specialty?: string | null;
}

export interface UsersMe {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string | null;
  phone_number: string | null;
  birth_date: string | null;
  gender: string | null;
  is_active: boolean;
  permissions: string[];
  institute_id: string | null;
  institute_name: string | null;
  employee_profile: UsersMeEmployeeProfile | null;
  student_profile: UsersMeStudentProfile | null;
  avatar_url: string | null;
}

export interface UserProfileData {
  id: number,
  user_id: number,
  first_name: string,
  last_name: string,
  middle_name: string,
  avatar: string,
  is_employee: boolean,
  position: string,
  group: string,
  email: string,
  number_phone: string,
  telegram_username: string,
  bio: string,
  custom_permission: [
    string
  ]
  username?: string;
  birth_date?: string | null;
  gender?: string | null;
  institute_name?: string | null;
  employments?: UserEmployment[];
}
export interface ResidesCourse {
  id: string,
  discipline_name: string,
}
export interface ResidesTheme {
  id: string,
  title: string,
}

export interface UserFilesList {
  id: string,
  file: string,
  file_names: string,
  resides: {
    course: ResidesCourse[],
    theme: ResidesTheme[]
  }
}
export interface UserGroupList {
  id: string,
  user_id: number,
  first_name: string,
  last_name: string,
  middle_name: string,
  avatar: string,
  is_employee: true,
  position: string,
  group: string

}
export interface Favorites {
  themes: CourseDetail[];
  courses: Course[]
}

export interface Notification {
  id: string;
  address_id: number;
  text: string;
  link: string;
  status: boolean;
  created_at: string;
  sender_id: number;
  type: string;
  sender_first_name: string;
  sender_last_name: string;
  // Keep these for backward compatibility if needed, or mapping
  sender?: string;
  title?: string;
  message?: string;
  date?: Date;
  tags?: string[];
}