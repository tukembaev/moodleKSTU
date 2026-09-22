export type TodayRole = "student" | "teacher";

export type TodayItemKind = "theme" | "test";

export type StudentState = "todo" | "waiting";

export type StudentBucket = "overdue" | "open" | "upcoming" | "waiting";

export type TodayCourse = {
  id: string;
  title: string;
  color: string;
};

export type TodayTheme = {
  id: string;
  courseId: string;
  title: string;
  kind: TodayItemKind;
  typeLess: string;
  opening: Date | null;
  deadline: Date | null;
  studentState: StudentState | null;
  submittedAt: Date | null;
};

export type ReviewItem = {
  id: string;
  courseId: string;
  themeId: string;
  kind: TodayItemKind;
  typeLess: string;
  themeTitle: string;
  courseTitle: string;
  deadline: Date | null;
  studentName: string;
  submittedAt: Date;
};

export type TodayAnnouncement = {
  id: string;
  courseId: string;
  author: string;
  text: string;
  createdAt: Date;
  pinned: boolean;
};

export type TodayData = {
  role: TodayRole;
  courses: TodayCourse[];
  items: TodayTheme[];
  reviews: ReviewItem[];
  announcements: TodayAnnouncement[];
};
