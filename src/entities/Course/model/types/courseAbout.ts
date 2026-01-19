export interface LearningOutcome {
  id: string;
  title: string;
  description?: string;
}

export interface CourseFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface RulesInfo {
  available: boolean;
  title: string;
  description: string;
  requirements: string[];
}

export interface CourseInstructor {
  id: string;
  name: string;
  avatar: string;
  position: string;
  bio: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
  socialLinks?: {
    telegram?: string;
    email?: string;
    linkedin?: string;
  };
}

export interface CourseAboutData {
  description: string;
  requirements: string;
  audience: string;
  learningOutcomes: LearningOutcome[];
  faq: CourseFAQ[];
  rules: RulesInfo;
  instructors: CourseInstructor[];
}

export interface UpdateCourseAboutPayload {
  description?: string;
  requirements?: string;
  audience?: string;
  learningOutcomes?: LearningOutcome[];
  faq?: CourseFAQ[];
  rules?: RulesInfo;
}
