
import CourseCardSkeleton from "./lib/skeletons/CourseCardSkeleton";
import ThemesSkeleton from "./lib/skeletons/ThemeCardSkeleton";

import { Course, CourseDetail, CourseLessonsStatusCounter, CourseProgress,TablePerfomance } from './model/types/course';
import CourseList from "./ui/CourseList";

import FavoriteCourses from "./ui/FavoriteSubjects/FavoriteCourses";


import { createCourse, createTheme, makeIsRead } from "./model/services/courseAPI";
import FavoriteThemes from "./ui/FavoriteSubjects/FavoriteThemes";
import GlobalCourseCarousel from "./ui/GlobalCourses/GlobalCourseCarousel";
import { ThemeFeed } from "./ui/Themes/ThemeFeed";


export {
    CourseCardSkeleton, CourseList, createCourse, FavoriteCourses, FavoriteThemes,
    ThemesSkeleton,createTheme,makeIsRead,GlobalCourseCarousel,ThemeFeed
};
export type { Course, CourseDetail, CourseLessonsStatusCounter, CourseProgress,TablePerfomance };

