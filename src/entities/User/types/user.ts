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
  }
 export interface ResidesCourse {
    id:string,
    discipline_name:string,
  }
  export interface ResidesTheme {
    id:string,
    title:string,
  }

  export interface UserFilesList {
    id: string,
    file: string,
    file_names: string,
    resides:{
      course:ResidesCourse[],
      theme:ResidesTheme[]
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
    themes:CourseDetail[];
    courses:Course[]
  }
