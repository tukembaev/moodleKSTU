# Backend API для раздела "О курсе"

## Описание

Данный документ описывает необходимые API endpoints для работы с данными раздела "О курсе" на странице курса.

---

## Модели данных (на основе `CourseAboutData` интерфейса)

### LearningOutcome (Чему вы научитесь)
```typescript
interface LearningOutcome {
  id: string;           // уникальный идентификатор
  title: string;        // название навыка (обязательное, 3-150 символов)
  description?: string; // описание (необязательное)
}
```

### CourseFAQ (Часто задаваемые вопросы)
```typescript
interface CourseFAQ {
  id: string;      // уникальный идентификатор
  question: string; // вопрос (обязательное, 5-200 символов)
  answer: string;   // ответ (обязательное, 10-1000 символов)
}
```

### RulesInfo (Условия для прохождения теста)
```typescript
interface RulesInfo {
  available: boolean;      // флаг доступности
  title: string;           // заголовок
  description: string;     // описание
  requirements: string[];  // список условий (максимум 8 пунктов, каждый 3-200 символов)
}
```

### CourseInstructor (Преподаватель)
```typescript
interface CourseInstructor {
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
```

### Полная модель CourseAboutData
```typescript
interface CourseAboutData {
  learningOutcomes: LearningOutcome[];  // Максимум 6 пунктов
  faq: CourseFAQ[];                     // Без ограничения
  stats: CourseStats;
  instructors: CourseInstructor[];
  rules: RulesInfo;                     // requirements максимум 8 пунктов
  tags: string[];
}
```

---

## API Endpoints

### 1. GET `/course-about/{courseId}`

**Описание:** Получение данных раздела "О курсе"

**Response:**
```json
{
  "learningOutcomes": [
    {
      "id": "1",
      "title": "Понимание основных концепций",
      "description": "Глубокое изучение теоретической базы"
    }
  ],
  "faq": [
    {
      "id": "1",
      "question": "Какой уровень подготовки необходим?",
      "answer": "Курс подходит для студентов с базовыми знаниями."
    }
  ],
  "stats": {
    "totalStudents": 1247,
    "completionRate": 78,
    "averageRating": 4.7,
    "totalReviews": 342,
    "totalHours": 40,
    "totalModules": 8,
    "totalLessons": 32,
    "lastUpdated": "2024-12-15T00:00:00Z"
  },
  "rules": {
    "available": true,
    "title": "Условия для прохождения",
    "description": "Чтобы завершить курс...",
    "requirements": [
      "Выполнить все обязательные задания",
      "Набрать минимум 60%",
      "Пройти итоговый тест"
    ]
  },
  "instructors": [...],
  "tags": ["Программирование", "IT"]
}
```

---

### 2. PATCH `/course-about/{courseId}`

**Описание:** Частичное обновление данных раздела "О курсе"

**Request Body (все поля опциональные):**

```json
{
  "learningOutcomes": [
    {
      "id": "1",
      "title": "Обновленный навык",
      "description": "Описание"
    },
    {
      "id": "new-123456",
      "title": "Новый навык",
      "description": ""
    }
  ],
  "faq": [
    {
      "id": "1",
      "question": "Обновленный вопрос?",
      "answer": "Обновленный ответ."
    }
  ],
  "rules": {
    "requirements": [
      "Новое условие 1",
      "Новое условие 2"
    ]
  }
}
```

**Валидация:**
- `learningOutcomes`: максимум 6 элементов
  - `title`: обязательное, 3-150 символов
  - `description`: необязательное
- `faq`: без ограничения количества
  - `question`: обязательное, 5-200 символов
  - `answer`: обязательное, 10-1000 символов
- `rules.requirements`: максимум 8 элементов
  - каждый элемент: 3-200 символов

**Response (успех):**
```json
{
  "success": true,
  "data": {
    // обновленные данные CourseAboutData
  }
}
```

**Response (ошибка валидации):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "learningOutcomes": "Maximum 6 items allowed",
      "learningOutcomes[0].title": "Title is required"
    }
  }
}
```

---

## Примечания для разработки

1. **ID для новых элементов:** При создании новых элементов на фронтенде используется временный ID формата `new-{timestamp}`. Бэкенд должен генерировать реальные ID при сохранении.

2. **Удаление элементов:** Если элемент отсутствует в PATCH запросе, но был ранее — он удаляется. Фронтенд отправляет полный массив актуальных элементов.

3. **Частичное обновление:** PATCH должен обновлять только переданные поля. Если поле не передано — оно не изменяется.

4. **Права доступа:** Только владелец курса (`course_owner`) может редактировать данные.

5. **Пустые секции:** Если секция пуста (пустой массив), фронтенд показывает placeholder текст. Бэкенд должен корректно обрабатывать пустые массивы.
