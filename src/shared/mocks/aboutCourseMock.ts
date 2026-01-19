// Мок данные для страницы "О курсе"
// После утверждения дизайна, попросите бекенд добавить эти ключи

export interface CourseFeature {
  id: string;
  icon: string; // название иконки из lucide-react
  title: string;
  description: string;
}

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

export interface RulesInfo {
  available: boolean;
  title: string;
  description: string;
  requirements: string[];
}


export interface CourseAboutData {
  features: CourseFeature[];
  learningOutcomes: LearningOutcome[];
  faq: CourseFAQ[];

  instructors: CourseInstructor[];
  rules: RulesInfo;
  tags: string[];
}

// Мок данные
export const mockCourseAboutData: CourseAboutData = {
  features: [
    {
      id: '1',
      icon: 'Clock',
      title: '40 часов',
      description: 'Общая продолжительность курса'
    },
    {
      id: '2',
      icon: 'BookOpen',
      title: '8 модулей',
      description: 'Структурированный материал'
    },
    {
      id: '3',
      icon: 'FileVideo',
      title: '32 видеоурока',
      description: 'Качественный видеоконтент'
    },
    {
      id: '4',
      icon: 'FileText',
      title: '15 практических заданий',
      description: 'Закрепление знаний'
    },
    {
      id: '5',
      icon: 'Award',
      title: 'Сертификат',
      description: 'По завершению курса'
    },
    {
      id: '6',
      icon: 'Infinity',
      title: 'Вечный доступ',
      description: 'К материалам курса'
    }
  ],

  learningOutcomes: [
    {
      id: '1',
      title: 'Понимание основных концепций и принципов дисциплины',
      description: 'Глубокое изучение теоретической базы'
    },
    {
      id: '2',
      title: 'Практические навыки решения задач',
      description: 'Применение знаний на практике'
    },
    {
      id: '3',
      title: 'Работа с современными инструментами и технологиями',
      description: 'Актуальные навыки для профессии'
    },
    {
      id: '4',
      title: 'Анализ и обработка данных',
      description: 'Умение работать с информацией'
    },
    {
      id: '5',
      title: 'Критическое мышление и решение проблем',
      description: 'Развитие soft skills'
    },
    {
      id: '6',
      title: 'Командная работа и презентация результатов',
      description: 'Коммуникативные навыки'
    }
  ],

  faq: [
    {
      id: '1',
      question: 'Какой уровень подготовки необходим для прохождения курса?',
      answer: 'Курс подходит для студентов с базовыми знаниями в области. Все необходимые предварительные требования указаны в разделе "Требования".'
    },
    {
      id: '2',
      question: 'Сколько времени потребуется на прохождение курса?',
      answer: 'Рекомендуемый темп - 5-7 часов в неделю. При таком темпе курс можно завершить за 6-8 недель.'
    },
    {
      id: '3',
      question: 'Как проходит оценка знаний?',
      answer: 'Оценка включает практические задания, тесты после каждого модуля и итоговый проект. Минимальный балл для получения сертификата - 60%.'
    },
    {
      id: '4',
      question: 'Можно ли пересдать задания?',
      answer: 'Да, большинство заданий можно пересдать. Условия пересдачи определяются преподавателем курса.'
    },
    {
      id: '5',
      question: 'Какие материалы доступны после завершения курса?',
      answer: 'После завершения вы сохраняете доступ ко всем видеоурокам, презентациям и дополнительным материалам курса.'
    }
  ],
  instructors: [
    {
      id: '1',
      name: 'Иосиф Тен',
      avatar: 'https://kstu.kg/fileadmin/user_upload/ten_i.g..jpg',
      position: 'Доцент, кандидат технических наук',
      bio: 'Опыт преподавания более 15 лет. Специализируется на информационных технологиях и программировании. Автор более 30 научных публикаций.',
      coursesCount: 12,
      studentsCount: 3500,
      rating: 4.8,
      socialLinks: {
        email: 'ten.i.g@kstu.kg',
        telegram: '@ten_ig'
      }
    }
  ],
  rules: {
    available: true,
    title: 'Условия для прохождения',
    description: 'Чтобы завершить курс вам потребуется выполнить следующие условия:',
    requirements: [
      'Выполнить все обязательные задания',
      'Набрать минимум 60% от максимального балла',
      'Пройти итоговый тест'
    ]
  },

  tags: ['Программирование', 'IT', 'Практика', 'Сертификат']
};

