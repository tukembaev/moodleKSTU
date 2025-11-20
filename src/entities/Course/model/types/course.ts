import { Test } from "entities/Test/model/types/test";
import { ResidesCourse, ResidesTheme } from "entities/User";

export type CourseOwner = {
    id: string;
    user_id:number;
    owner_name: string;
    main: boolean;
    avatar:string;
    position:string;
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
    count_hours: number;
    status:boolean;
    result:number
    locked: boolean;
    is_favorite:boolean;
    discipline_name:string
    description: string;
  }
  export interface ThemeFaq{
    id: string,
    question: string,
    theme:string,
    answer: string
  }

  export type FeedItem = {
    id: string;
    user: {
      user_id: number;
      name: string;
      avatar: string;
    };
    theme:string;
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
    icon?:string;
    title: string;
    discipline: string;
    discipline_name: string;
    category:string;
    category_icon:string
    control_form:string;
    credit:number;
    is_end:boolean;
    additional_points:AdditionalCoursePoints[]
    course_owner: CourseOwner[];
    count_hours:number;
    count_lb_pr: CourseLessonsStatusCounter;
    progress: CourseProgress;
    course_points:number;
    max_points:number;
    count_stud:number;
    is_favorite:boolean;
  };
  

  export interface CourseThemes {
    id: string;
    discipline: string;
    discipline_name: string;
    credit: number;
    control_form: string;
    count_hours:number;
    courses_hours_left:number;
    max_points:number;
    theme_points:number;
    count_stud:number;
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
  export interface FileAnswer {
    id: string;
    file: string;
    file_names: string;
    is_read: {
      is_read: boolean;
      read: Date
    };
    created_at: Date;
    resides:{
              course:ResidesCourse[],
              theme:ResidesTheme[]
            }
  }
  export interface StudentsAnswers{
    id: string,
    task: string,
    fullname: string,
    avatar: string,
    group: string,
    points:number,
    status: boolean,
    locked:boolean,
    user_id:number,
    comment:string,
    max_points:number,
    files: FileAnswer[]
  }
 export  interface ThemeItem {
    id: string;
    title: string;
    max_points:number;
    id_answer_task?: string | null;
    stud_points?: number | null;
  }
  
  export interface TestItem {
    id: string;
    title: string;
    max_points:number;
    id_result: string | null;
    result: number | null;
  }
  
 export interface TablePerfomance {
    id: string;
    user_id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    avatar: string;
    is_employee: boolean;
    position: string | null;
    group: string;
    email: string;
    bio: string;
    number_phone: string;
    telegram_username: string;
    max_points_course:number;
    is_end:boolean;
    themes: {
      pr: ThemeItem[];
      lb: ThemeItem[];
      srs: ThemeItem[];
      other: ThemeItem[];
      tests: TestItem[];
    };
  }
  