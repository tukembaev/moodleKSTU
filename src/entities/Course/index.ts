
import CourseCardSkeleton from "./lib/skeletons/CourseCardSkeleton";
import ThemesSkeleton from "./lib/skeletons/ThemeCardSkeleton";

import { Course, CourseDetail, CourseLessonsStatusCounter, CourseProgress, TablePerfomance, StudyTask } from './model/types/course';
import CourseList from "./ui/CourseList";




import { createCourse, createTheme, makeIsRead } from "./model/services/courseAPI";

import GlobalCourseCarousel from "./ui/GlobalCourses/GlobalCourseCarousel";
import { ThemeFeed } from "./ui/Themes/ThemeDetail/ThemeFeed";


export {
    CourseCardSkeleton, CourseList, createCourse,
    ThemesSkeleton, createTheme, makeIsRead, GlobalCourseCarousel, ThemeFeed
};
export type { Course, CourseDetail, CourseLessonsStatusCounter, CourseProgress, TablePerfomance, StudyTask };
