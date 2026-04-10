// Типы для статистики на основе MOCK_STATISTICS_DATA.json

export interface PositionInfo {
  position: number;
  total_students: number;
  percentage_better: number;
  group?: string;
  stream?: string;
  average_score?: number;
}

export interface CourseStudentInfo {
  points: number;
  is_end: boolean;
  group?: string;
  stream?: string;
}

export interface CourseInfo {
  id: string;
  discipline_name: string;
  credit?: number;
  control_form?: string;
  description?: string;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  on_review?: number;
  not_started?: number;
  overdue?: number;
  completion_percentage: number;
  earned_points?: number;
  max_points?: number;
  average_score?: number;
}

export interface TestStatistics {
  total: number;
  completed: number;
  not_completed: number;
  average_score: number;
  average_correct_percentage: number;
}

export interface UpcomingDeadline {
  course_detail: {
    id: string;
    title: string;
    type_less: string;
    max_points: number;
    deadline: string;
  };
  course: CourseInfo;
  days_remaining: number;
}

export interface RecentGrade {
  task_files: {
    id: string;
    points: number;
    status: boolean;
    comment: string | null;
    created_at: string;
  };
  course_detail: {
    id: string;
    title: string;
    type_less: string;
    max_points: number;
  };
  course: CourseInfo;
}

export interface CourseDashboardItem {
  id: string;
  discipline_name: string;
  course_students: CourseStudentInfo;
  completion_percentage: number;
  current_points: number;
  max_points: number;
  position_in_group?: PositionInfo;
  position_in_stream?: PositionInfo;
  tasks_statistics: TaskStatistics;
  tests_statistics: TestStatistics;
}

export interface OverallProgress {
  completion_percentage: number;
  current_points: number;
  max_points: number;
  active_courses_count: number;
  completed_courses_count: number;
  average_score: number;
  total_points: number;
}

export interface StudentDashboard {
  overall_progress: OverallProgress;
  courses: CourseDashboardItem[];
  upcoming_deadlines: UpcomingDeadline[];
  recent_grades: RecentGrade[];
}

// Статистика по курсу для студента
export interface ExtraPointsItem {
  id: string;
  points: number;
  reason: string;
  created_at: string;
}

export interface ExtraPoints {
  total: number;
  items: ExtraPointsItem[];
}

export interface OverallStatistics {
  completion_percentage: number;
  current_points: number;
  max_points: number;
  extra_points: ExtraPoints;
}

export interface TaskByType {
  [key: string]: TaskStatistics & {
    viewed?: number;
    not_viewed?: number;
    view_percentage?: number;
  };
}

export interface TaskListItem {
  course_detail: {
    id: string;
    title: string;
    type_less: string;
    max_points: number;
    deadline: string;
    locked: boolean;
    open_date: string;
    description: string;
  };
  task_files: {
    id: string;
    points: number;
    status: boolean;
    comment: string | null;
    created_at: string;
  } | null;
  status: "completed" | "on_review" | "not_started" | "overdue";
  week?: {
    id: string;
    title: string;
    module?: {
      id: string;
      title: string;
    };
  };
}

export interface TestListItem {
  testing: {
    id: string;
    title: string;
    max_points: number;
    description: string;
    time_limit: number;
  };
  result_testing: {
    id: string;
    score: number;
    total_questions: number;
    completed_at: string;
    time_spent: number;
  } | null;
  test_attempt: {
    id: string;
    total_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    skipped_questions: number;
    time_spent: number;
    completion_date: string;
    answers_data: Record<string, any>;
  } | null;
  attempts_count: number;
  best_score: number | null;
  correct_percentage: number | null;
}

export interface StudentCourseDetail {
  course: CourseInfo;
  course_students: CourseStudentInfo;
  overall_statistics: OverallStatistics;
  tasks_statistics: {
    overall: TaskStatistics;
    by_type: TaskByType;
    tasks_list: TaskListItem[];
  };
  tests_statistics: {
    overall: TestStatistics;
    tests_list: TestListItem[];
  };
  materials_statistics?: {
    viewed_count: number;
    total_count: number;
    view_percentage: number;
  };
  discussion_statistics?: {
    comments_count: number;
    replies_count: number;
    likes_received: number;
  };
  comparison_statistics?: {
    group: PositionInfo;
    stream: PositionInfo;
  };
}

// Статистика для учителя
export interface TeacherOverallStatistics {
  total_courses: number;
  total_students: number;
  active_courses: number;
  completed_courses: number;
  unchecked_works: number;
  average_course_score: number;
}

export interface TeacherCourseStatistics {
  course: CourseInfo;
  students_statistics: {
    total_students: number;
    active_students: number;
    completed_students: number;
    completion_percentage: number;
    average_score: number;
    max_score: number;
    min_score: number;
  };
  tasks_statistics: {
    total_tasks: number;
    total_responses: number;
    checked_responses: number;
    unchecked_responses: number;
    completion_percentage: number;
    average_score: number;
  };
  tests_statistics: {
    total_tests: number;
    total_attempts: number;
    average_score: number;
    completion_percentage: number;
  };
  unchecked_works_count: number;
}

export interface RecentActivity {
  checked_today: number;
  checked_this_week: number;
  average_check_time_hours: number;
  check_distribution_by_days: Array<{
    date: string;
    count: number;
  }>;
}

export interface TeacherDashboard {
  overall_statistics: TeacherOverallStatistics;
  courses: TeacherCourseStatistics[];
  recent_activity: RecentActivity;
}

// Детальная статистика курса для учителя
export interface ScoreDistribution {
  excellent?: { range: string; count: number; percentage: number };
  good?: { range: string; count: number; percentage: number };
  satisfactory?: { range: string; count: number; percentage: number };
  unsatisfactory?: { range: string; count: number; percentage: number };
}

export interface TeacherCourseStudentsStatistics {
  total_students: number;
  active_students: number;
  completed_students: number;
  completion_percentage: number;
  average_score: number;
  max_score: number;
  min_score: number;
  median_score?: number;
  score_distribution?: ScoreDistribution;
}

export interface TaskDetail {
  course_detail: {
    id: string;
    title: string;
    type_less: string;
    max_points: number;
    deadline: string;
  };
  responses_count: number;
  checked_count: number;
  unchecked_count: number;
  average_score: number;
  max_score: number;
  min_score: number;
  completion_percentage: number;
  overdue_responses: number;
}

export interface TeacherCourseTasksStatistics {
  overall: {
    total_tasks: number;
    total_responses: number;
    checked_responses: number;
    unchecked_responses: number;
    completion_percentage: number;
    average_score: number;
  };
  by_type: {
    [key: string]: {
      total_tasks: number;
      total_responses: number;
      checked_responses: number;
      unchecked_responses: number;
      completion_percentage: number;
      average_score: number;
      score_distribution?: {
        max: number;
        min: number;
        median: number;
      };
    };
  };
  tasks_detail: TaskDetail[];
}

export interface QuestionAnalysis {
  question: {
    id: string;
    question_text: string;
    order: number;
  };
  correct_count: number;
  total_attempts: number;
  correct_percentage: number;
  most_popular_wrong_option?: {
    option: {
      id: string;
      text: string;
    };
    selected_count: number;
  } | null;
}

export interface TestDetail {
  testing: {
    id: string;
    title: string;
    max_points: number;
    description: string;
    time_limit: number;
  };
  attempts_count: number;
  unique_students: number;
  average_score: number;
  max_score: number;
  min_score: number;
  median_score: number;
  average_time_spent: number;
  average_correct_percentage: number;
  score_distribution: {
    [key: string]: number;
  };
  questions_analysis: {
    hardest_questions: QuestionAnalysis[];
    easiest_questions: QuestionAnalysis[];
  };
}

export interface TeacherCourseTestsStatistics {
  overall: {
    total_tests: number;
    total_attempts: number;
    unique_students: number;
    average_score: number;
    average_correct_percentage: number;
    completion_percentage: number;
  };
  tests_detail: TestDetail[];
}

export interface StudentListItem {
  user_data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    group: string;
  };
  course_students: CourseStudentInfo;
  overall_score: number;
  tasks_completion_percentage: number;
  average_test_score: number;
  last_activity: string;
  overdue_tasks_count: number;
}

export interface TeacherCourseDetail {
  course: CourseInfo;
  students_statistics: TeacherCourseStudentsStatistics;
  tasks_statistics: TeacherCourseTasksStatistics;
  tests_statistics: TeacherCourseTestsStatistics;
  students_list: StudentListItem[];
  top_students: Array<{
    user_data: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      group: string;
    };
    course_students: CourseStudentInfo;
    overall_score: number;
    position: number;
  }>;
  materials_statistics?: {
    total_materials: number;
    viewed_by_students: {
      total_views: number;
      average_views_per_student: number;
      most_viewed: Array<{
        course_detail_material: {
          id: string;
          description: string;
        };
        views_count: number;
      }>;
      least_viewed: Array<{
        course_detail_material: {
          id: string;
          description: string;
        };
        views_count: number;
      }>;
    };
  };
  discussion_statistics?: {
    total_comments: number;
    comments_by_theme: Array<{
      course_detail: {
        id: string;
        title: string;
      };
      comments_count: number;
    }>;
    most_active_students: Array<{
      user_data: {
        id: string;
        first_name: string;
        last_name: string;
      };
      comments_count: number;
    }>;
  };
  checking_statistics?: {
    workload: {
      unchecked_works: number;
      checked_today: number;
      checked_this_week: number;
      average_check_time_hours: number;
    };
    quality: {
      average_score: number;
      works_with_comments: number;
      works_with_comments_percentage: number;
      score_distribution: {
        [key: string]: number;
      };
    };
    unchecked_works_list: Array<{
      task_files: {
        id: string;
        points: number;
        status: boolean;
        created_at: string;
      };
      user_data: {
        id: string;
        first_name: string;
        last_name: string;
      };
      course_detail: {
        id: string;
        title: string;
      };
      days_waiting: number;
    }>;
  };
  extra_points_statistics?: {
    total_points: number;
    total_allocations: number;
    unique_recipients: number;
    average_allocation: number;
    by_reason: Array<{
      reason: string;
      count: number;
      total_points: number;
    }>;
    by_student: Array<{
      user_data: {
        id: string;
        first_name: string;
        last_name: string;
      };
      total_extra_points: number;
      allocations: Array<{
        extra_points: ExtraPointsItem;
      }>;
    }>;
  };
  activity_statistics?: {
    by_days: Array<{
      date: string;
      tasks_completed: number;
      average_score: number;
    }>;
    by_weeks: Array<{
      week: { id: string; title: string };
      tasks_completed: number;
      average_score: number;
    }>;
    activity_peaks: Array<{
      date: string;
      tasks_count: number;
    }>;
  };
  comparison_statistics?: {
    by_groups: Array<{
      group: string;
      average_score: number;
      total_students: number;
      completion_percentage: number;
    }>;
    by_streams: Array<{
      stream: string;
      average_score: number;
      total_students: number;
      completion_percentage: number;
    }>;
  };
}

