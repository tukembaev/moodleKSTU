# Unet LMS — спецификация клиента для мобильного приложения

Документ описывает **фактическое поведение текущего веб-клиента** (`moodleKSTU`, React + Vite + TypeScript) и его контракт с бэкендом. Это источник правды для агента, который будет собирать мобильное приложение: экраны, роли, API, типы, загрузки файлов, авторизация, realtime.

Проект: LMS КГТУ (Unet LMS). Студенты и преподаватели работают с курсами, темами, сдачами файлов, тестами, лентой курса, замечаниями.

> **Важно для мобилки.** Веб прячет UUID в `sessionStorage` и чистит URL. В нативном приложении так делать не нужно: передавайте `courseId`, `themeId`, `testId` явно в навигации. Cookie SSO и CSRF — обязательны, их нельзя заменить «просто Bearer», пока бэкенд не отдаёт отдельный mobile-token.

---

## Оглавление

1. [Обзор продукта](#1-обзор-продукта)
2. [Стек и сервисы бэкенда](#2-стек-и-сервисы-бэкенда)
3. [Авторизация и сессия](#3-авторизация-и-сессия)
4. [Роли и права](#4-роли-и-права)
5. [Идентификаторы](#5-идентификаторы)
6. [Карта экранов](#6-карта-экранов)
7. [Навигация веб vs мобилка](#7-навигация-веб-vs-мобилка)
8. [Доменные типы](#8-доменные-типы)
9. [Каталог API](#9-каталог-api)
10. [Логика экранов и вызовы бэкенда](#10-логика-экранов-и-вызовы-бэкенда)
11. [Загрузки и скачивания](#11-загрузки-и-скачивания)
12. [Realtime-уведомления](#12-realtime-уведомления)
13. [Поиск](#13-поиск)
14. [Замечания (remarks)](#14-замечания-remarks)
15. [Тесты и банк вопросов](#15-тесты-и-банк-вопросов)
16. [Известные заглушки и пробелы](#16-известные-заглушки-и-пробелы)
17. [Чеклист для мобильного агента](#17-чеклист-для-мобильного-агента)

---

## 1. Обзор продукта

Unet LMS — образовательная платформа поверх университетского SSO (UNET users-service).

**Студент** видит свои курсы, открывает темы, скачивает материалы, сдаёт файлы, проходит открытые тесты, смотрит «Мои сдачи», ленту курса, FAQ и замечания преподавателя.

**Преподаватель (employee)** создаёт курсы и темы, грузит материалы, проверяет сдачи, ставит баллы и комментарии, ведёт ленту/объявления, журнал успеваемости, приглашает студентов QR-ссылкой, создаёт тесты и коллекции вопросов.

Аккаунты создаются **не в этом приложении**. Регистрации пользователей нет. Вход: PIN/логин + пароль или корпоративный Google.

---

## 2. Стек и сервисы бэкенда

Веб: React 19, React Router 7, TanStack Query 5, Axios, cookie session.

Прод-хосты (актуальный `API_TARGET = "prod"`):

| Сервис | Origin | Axios instance | baseURL |
|--------|--------|----------------|---------|
| Education API | `https://uadmin.kstu.kg/educations` | `$api_edu` | `{origin}/api/v1/edu/` |
| LMS users (курсы, профили LMS) | тот же origin | `$api_users` | `{origin}/api/v1/users/` |
| Edu root (чаты, remarks, search) | тот же origin | `$api_base_edu`, `$api2` | `{origin}/api/` |
| Users-service SSO | `https://uadmin.kstu.kg/users/api/v1/` | `$api_auth` | этот origin |
| Notifications | `https://uadmin.kstu.kg/edu-service/` | `$api_notification` | этот origin |
| Notification WS | `wss://uadmin.kstu.kg/edu-service/ws/notification/{userId}/` | WebSocket | — |

Локально (`API_TARGET = "local"`): относительные URL `/api/...`, Vite проксирует на `http://localhost:8005`. Media: `/media` → тот же origin.

Переопределения env:

- `VITE_API_HOST` — хост educations
- `VITE_USERS_API_HOST` — хост users-service

**Соглашения Django:** почти все пути с **завершающим слэшем**. Исключение: `DELETE course/{id}` без слэша.

**Credentials:** все инстансы `withCredentials: true`. Мобилка должна хранить cookies (в т.ч. HttpOnly) в cookie jar.

Заголовки каждого запроса (кроме login):

```
Cookie: <session cookies>
X-Profile-Context: employee | student
```

Для **записей** на users-service (`POST/PUT/PATCH/DELETE` к `/users/api/...`):

```
X-CSRF-TOKEN: <csrf_access_token cookie или localStorage csrf_token>
x-csrf-token: то же
```

Refresh:

```
POST https://uadmin.kstu.kg/users/api/v1/users/refresh
Cookie + X-CSRF-TOKEN из cookie csrf_refresh_token
Body: пустая строка ""
```

Ответы списков иногда приходят как массив, иногда как `{ results | items | data }`. Клиент это нормализует (лента курса, банки вопросов). Мобилка должна делать то же.

Стиль полей смешанный: часть API — `snake_case`, тесты — `camelCase` (`maxPoints`, `questionType`, `showCorrectAnswers`).

---

## 3. Авторизация и сессия

### 3.1. Поток входа

Публичный экран только `/` (логин). Всё остальное требует сессию **и** выбранный контекст `employee | student`.

```
1. POST users/auth  { username, password }
   или POST users/auth/google { id_token }
2. Если у пользователя два профиля → экран выбора: Сотрудник / Студент
   POST users/auth/context { context: "employee" | "student" }
3. Если профиль один — выбирается автоматически
4. Редирект: /courses, либо /courses/invite если в URL/сторе лежит приглашение
```

Google (веб): редирект на Google, возврат на `/#id_token=...&nonce=...`, клиент шлёт `id_token` на `users/auth/google`. На мобилке используйте native Google Sign-In и тот же `id_token`.

SSO: если cookie users-service уже есть (другой UNET-сайт), клиент делает `POST users/refresh` при старте (`restoreSessionFromCookie`). Если refresh не вышел — `GET users/auth/contexts`.

### 3.2. Эндпоинты auth

Base: `https://uadmin.kstu.kg/users/api/v1/`

| Метод | Путь | Тело | Ответ | Когда |
|-------|------|------|-------|-------|
| POST | `users/auth` | `{ username, password }` | сессия + user payload | логин |
| POST | `users/auth/google` | `{ id_token }` | то же | Google |
| GET | `users/auth/contexts` | — | `ProfileContext[]` или `{ contexts \| available_contexts }` | список профилей |
| POST | `users/auth/context` | `{ context: "employee" \| "student" }` | сессия с активным контекстом | выбор роли |
| POST | `users/refresh` | `""` | user payload, обновляет cookies | 401 / bootstrap |
| POST | `users/auth/logout` | — | — | выход |
| GET | `users/me` | — | `UsersMe` | шапка, свой профиль |

Клиент **не** кладёт JWT в `Authorization`. Поле `access` в payload может приходить, но запросы идут через cookie.

### 3.3. Локальное состояние сессии (веб)

`localStorage`:

| Ключ | Содержимое |
|------|------------|
| `user` | `StoredUser` (id, имя, avatar, role, …) |
| `active_context` | `{ type, full_name?, avatar_url?, position? }` |
| `available_contexts` | массив профилей |
| `csrf_token` | CSRF, если бэкенд вернул `csrf_token` в JSON |

Cookies (читает клиент, где может): `csrf_access_token`, `csrf_refresh_token`. Session cookie — HttpOnly.

`user.id` / `user.user` / `user.user_data.id` — числовой id для WS и LMS-профиля.

### 3.4. Refresh на 401

1. Любой `$api_*` получил 401.
2. Если URL не login/refresh/logout/context — один общий `refreshSession()`.
3. Повтор исходного запроса.
4. Если refresh упал — logout и на логин.

Не ретраить: `users/auth`, `users/auth/google`, `users/auth/logout`, `users/auth/context(s)`, `users/refresh`, `forgot-password`.

### 3.5. Типы auth

```ts
type AuthContextType = "employee" | "student";

type ProfileContext = {
  type: AuthContextType;
  full_name?: string;
  avatar_url?: string;
  position?: string;
};

type LoginCredentials = { username: string; password: string };

type ParsedAuthResult = {
  user: StoredUser;
  requiresContextSelection: boolean;
  availableContexts: ProfileContext[];
  activeContext: ProfileContext | null;
};

type UsersMe = {
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
  employee_profile: {
    is_active: boolean;
    employments: UserEmployment[];
  } | null;
  student_profile: {
    is_active?: boolean;
    group?: string | null;
    group_name?: string | null;
    faculty?: string | null;
    specialty?: string | null;
  } | null;
  avatar_url: string | null;
};

type UserEmployment = {
  id: string;
  organization_id: string;
  organization_name: string;
  position: string;
  rate: number;
  employment_type: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
};
```

`isStudent` в UI = `active_context === "student"`. Иначе employee. Флаги `is_univer_admin` и т.п. **не используются** для роутинга.

---

## 4. Роли и права

| Роль | Как определяется | Что видит |
|------|------------------|-----------|
| Гость | нет сессии / нет `active_context` | только логин |
| Студент | `X-Profile-Context: student` | курсы, сдачи, тесты курса (проход), лента, материалы, замечания по теме |
| Преподаватель | `X-Profile-Context: employee` | + создание курсов/тем/тестов, журнал, управление, банк вопросов, оценка |
| Владелец курса | `course_owner[0].user_id === auth.id` | удаление материалов, редактирование «О курсе», QR-приглашение |
| Сопреподаватель | отдельной роли нет | employee видит teacher-вкладки; часть действий всё равно проверяет owner на бэкенде |

Студенту **закрыты** (веб редиректит на `/courses`):

- список тестов `/test` (не прохождение `/test/pass`)
- банк вопросов `/question-bank`

Студент **может** открыть `/test/pass` из темы курса, если тест открыт и ещё не сдан.

Teacher-only вкладки курса: «Успеваемость», «Управление», кнопка QR.

Student-only вкладки курса: «Мои сдачи». В теме: вкладка «Замечания».

---

## 5. Идентификаторы

| Сущность | Тип id | Где |
|----------|--------|-----|
| Пользователь SSO / LMS `user_id` | `number` | scoring, remarks, remove student, WS, профиль `/user/{id}/` |
| Курс | UUID string | почти все course-* |
| Тема (`course_detail`) | UUID string | материалы, ответы, FAQ, discussion |
| Тест | UUID string | `testing/{id}/`, submit |
| Банк вопросов | UUID string | `question-banks/{id}/` |
| Вопрос банка | UUID string | |
| Сдача / submission | UUID string | версии файлов, remarks |
| Файл ответа | UUID string | delete, is_read |
| Объявление | UUID string | |
| Поток курса | UUID string | |
| Invite `link_id` | UUID string | вместе с `course_id` |
| Группа студента | string (название), не UUID | `my-team/{group}/` |
| Кафедра / институт | `number` | university API |

`UsersMe.id` — string, LMS `UserProfileData.id` и `user_id` — number. Для API курса/замечаний используйте **числовой** `user_id` из LMS-профиля / `resolveUserId(storedUser)`.

---

## 6. Карта экранов

Веб-маршруты → логические экраны мобилки.

| Веб path | Auth | Кто | Назначение | Приоритет мобилки |
|----------|------|-----|------------|-------------------|
| `/` | public | все | Логин + выбор контекста | Обязательно |
| `/courses` | yes | все | Список «Мои курсы» | Обязательно |
| `/courses/course_themes` | yes | все | Рабочая область курса | Обязательно |
| `/courses/:id/feed` и `.../announcements` | yes | все | Диплинк в ленту курса | Обязательно |
| `/courses/invite` (+ алиасы) | yes | все | Вступление по QR/ссылке | Обязательно |
| `/test/pass` | yes | студент | Прохождение теста | Обязательно |
| `/test/quiz-result` | yes | студент | Результат попытки | Обязательно |
| `/profile`, `/profile/:id` | yes | все | Профиль + файлы | Высокий |
| `/test` | yes | teacher | Банк тестов преподавателя | Высокий (teacher) |
| `/test/add-quiz`, `/test/edit` | yes | teacher | Создание/редактирование теста | Высокий (teacher) |
| `/question-bank`, `/question-bank/bank` | yes | teacher | Коллекции вопросов | Средний (teacher) |
| `/remarks` | yes | все | Глобальный список замечаний | Средний |
| `/statistic` | yes | все | Дашборд статистики | **Не делать: mock JSON** |
| `/billing` | yes | все | Оплата | **Не делать: UI-заглушка** |
| `/groups` | yes | все | Группы | **API заглушен** |
| `/universities` | yes | все | Институты/кафедры | Низкий, нет в навбаре |
| `*` | — | — | 404 | по желанию |

Алиасы приглашения (все ведут на экран join):

- `/courses/invite`
- `/courses/invite/:courseId/:linkId`
- `/course/:courseId/:linkId/invite` — формат бэкенда / QR
- `/courses/course_themes/:id/invite[/:linkId]`
- `?course_id=&link_id=`

Существуют, но **не подключены** к роутеру: MainPage, AboutUsPage, RegistrationPage, CollaboratePage, CategoryPage. Регистрацию аккаунта не реализовывать.

---

## 7. Навигация веб vs мобилка

### Веб desktop

Шапка: Мои курсы | (teacher) Тестирование | Коллекция вопросов | поиск | уведомления | меню профиля.

### Веб mobile

Нижний бар: Курсы | Поиск (sheet) | Уведомления (sheet) | Профиль (sheet). Скрыт на `/test/pass`.

Курс: на узком экране вкладки курса — picker; список тем и деталь темы — два шага (back закрывает тему).

### Что копировать в мобилку

- Нижняя навигация как на веб-мобилке: Курсы / Поиск / Уведомления / Профиль.
- Teacher: дополнительный пункт «Тесты» и «Банк» в профиле или отдельный таб.
- Во время прохождения теста — fullscreen, без таббара.
- Диплинки: `https://{host}/course/{courseId}/{linkId}/invite` и `https://{host}/courses/{courseId}/feed`.

Hidden-id слой веба **не копировать**.

---

## 8. Доменные типы

Ниже — типы, которые клиент реально ждёт от API. Опциональные поля помечены.

### 8.1. Курс и тема

```ts
type CourseOwner = {
  id: string;
  user_id: number;
  owner_name: string;
  main: boolean;
  avatar: string;
  position: string;
  course: string;
  bio: string;
  review: { count_courses: number; count_reviews: number; rate: number };
  owner: string;
};

type CourseProgress = {
  success: number;
  success_pr: number;
  failure: number;
  failure_pr: number;
};

type CourseLessonsStatusCounter = {
  lb_done: number;
  lb_left: number;
  pr_done: number;
  pr_left: number;
};

type AdditionalCoursePoints = {
  id: string;
  course: string | number;
  points: number;
  reason: string | number;
};

type Course = {
  id: string;
  icon?: string;
  title: string;
  discipline: string;
  discipline_name: string;
  category: string;
  category_icon: string;
  organization_id?: string;
  organization_name?: string;
  is_end: boolean;
  additional_points: AdditionalCoursePoints[];
  course_owner: CourseOwner[];
  count_lb_pr: CourseLessonsStatusCounter;
  progress: CourseProgress;
  course_points: number;
  max_points: number;
  count_stud: number;
  is_favorite: boolean;
};

/** GET course-theme/{id}/ — шапка курса + плоский список тем */
type CourseAllMaterials = {
  id: string;
  discipline_name: string;
  category: string;
  category_icon: string;
  organization_id?: string;
  organization_name?: string;
  is_favorite: boolean;
  audience: string;
  requirements: string;
  description: string;
  count_lb_pr: CourseLessonsStatusCounter;
  progress: CourseProgress;
  course_points: number;
  count_stud: number;
  is_end: boolean;
  course_owner: CourseOwner[];
  additional_points: AdditionalCoursePoints[];
  detail: Array<{
    id: string;
    week: string;
    title: string;
    type_less: string;       // см. справочник типов
    max_points: number;
    deadline: string;
    status: boolean;         // сдано ли текущим пользователем
    locked: boolean;
    open_date: string;
    description: string;
    discipline_name: string;
    is_favorite: boolean;
    result: string;          // балл строкой / пусто
    comment?: string | null;
    active_remarks_count: number;
  }>;
};

type CourseModulesResponse = {
  id: string;
  discipline_name: string;
  category: string;
  category_icon: string;
  audience: string;
  requirements: string;
  description: string;
  course_owner: CourseOwner[];
  modules: Array<{
    id: string;
    title: string;
    weeks: Array<{ id: string; module: string; title: string }>;
  }>;
};

type CourseMaterials = {
  id: string;
  file: string;
  file_name: string;
  description: string;
  url: string;
  url_name: string;
  course_detail: string;
  files: string;
};

type CourseMaterialFile = {
  id: string;
  file_name: string;
  file: string;       // URL
  file_id: string;
  theme: { id: string; title: string };
  uploaded_at: string;
};
```

Типы занятий `type_less` (ключ → подпись):

| Ключ | Коротко | Полностью |
|------|---------|-----------|
| `lb` | Лб | Лабораторная работа |
| `pr` | Пр | Практическое занятие |
| `lc` | Лк | Лекционное занятие |
| `srs` | СРС | СРС |
| `test` | Тест | Тест |
| `rgz` | РГЗ | РГЗ |
| `rgr` | РГР | РГР |
| `umk` | УМК | УМК |
| `other` | Другое | Другое |

Бэкенд иногда отдаёт уже русскую строку (`"Лабораторная работа"`, `"Лб"`). UI мапит ключ через `TYPE_LABELS`, иначе показывает как есть.

Создание темы шлёт **ключ** (`lb`, `pr`, …). Редактирование на вебе иногда шлёт уже русскую подпись (`toTypeLabel`) — бэкенд принимает оба варианта.

### 8.2. Сдачи и оценки

```ts
type FileAnswer = {
  id: string;
  file: string;                 // URL
  file_names: string;
  created_at: string;
  is_read: { is_read: boolean; read: string | null };
  submission_id?: string | null;
  version?: number | null;
  is_current?: boolean;
  can_resubmit?: boolean;
  can_delete?: boolean;
};

type TaskSubmission = {
  id: string;
  version: number;
  is_current: boolean;
  created_at: string;
  files: FileAnswer[];
};

type StudentsAnswers = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  avatar: string;
  role: string;
  position: string;
  email: string;
  bio: string;
  number_phone: string;
  telegram_username: string;
  group: string;
  fullname: string;
  locked: boolean;
  task: string;
  max_points: number;
  created_at: string;
  user_id: number;
  course_id?: string;
  status: string;
  points: number;
  comment?: string | null;
  remarks: number;
  pending_remarks: number;
  responded_remarks?: number;
  files: FileAnswer[];
  submissions?: TaskSubmission[];
  can_resubmit?: boolean;
  current_version?: number | null;
};

type SubmissionStatus = "submitted" | "not_submitted" | "overdue";

type MySubmissionItem = {
  theme_id: string;
  title: string;
  type_less: string;
  week: number | null;
  deadline: string | null;
  status: SubmissionStatus;
  points: number | null;        // null + submitted → «На проверке»
  max_points: number;
  comment: string | null;
  current_version: number | null;
  submission_id: string | null;
  task_file_id: string | null;
  submitted_at: string | null;
};

type CourseExtraPoint = {
  id: string;
  course: string;
  points: number;
  reason: string;
};

type MySubmissionsResponse = {
  course_id: string;
  discipline_name: string;
  extra_points: CourseExtraPoint[];
  results: MySubmissionItem[];
};

type TablePerfomance = {
  id: number;                   // user_id студента
  first_name: string;
  last_name: string;
  middle_name: string | null;
  avatar: string | null;
  role: string;
  position: string | null;
  email: string;
  bio: string | null;
  number_phone: string | null;
  telegram_username: string | null;
  group: string | null;
  is_end: boolean;
  max_points_course: number;
  themes: Array<{
    id: string;
    title: string;
    max_points: number;
    id_answer_task: string | null;
    stud_points: number | null;
    comment?: string | null;
    due_date: string | null;
  }>;
};

type RateAnswerPayload = {
  points?: number;
  comment?: string | null;
  answer?: string;              // id сдачи / файла
  result?: string;
  questionId?: string;
};
```

Правила сдачи файлов на клиенте:

- Нет файлов → можно загрузить.
- Если есть `can_resubmit` — слушаем его.
- Иначе разрешаем.
- Удаление файла: `file.can_delete`, иначе эвристика «это моя текущая несданная версия».
- Версии группируются по `submission_id` / `version`. Текущая — `is_current` или максимальный `version`.

### 8.3. Лента и объявления

```ts
type AnnouncementAuthor = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  middle_name: string | null;
  avatar: string | null;
  full_name: string;
};

type CourseAnnouncement = {
  id: string;
  course_id: string;
  author: AnnouncementAuthor;
  text: string;
  is_pinned: boolean;
  can_manage: boolean;
  created_at: string;
  updated_at: string;
};

type CourseFeedKind =
  | "announcement"
  | "material_created"
  | "material_updated"
  | "material_replaced"
  | "material_deleted";

type CourseFeedItem = {
  id: string;
  kind: CourseFeedKind;
  created_at: string;
  updated_at?: string | null;
  author?: AnnouncementAuthor | null;
  is_pinned?: boolean;
  can_manage?: boolean;
  text?: string | null;
  material?: {
    id?: string | null;
    file_name: string;
    previous_file_name?: string | null;
    file?: string | null;
    theme?: { id: string; title: string } | null;
  } | null;
  announcement?: CourseAnnouncement | null;
};

type CourseFeedQuery = {
  sort?: "desc" | "asc";          // default desc
  kind?: "all" | "announcement" | "materials";
};
```

Нормализация ленты: алиасы `material_added` → `material_created`, `deleted` → `material_deleted` и т.д. Список может быть массивом или `{ items | results | data }`. Закреплённые объявления сверху (бэкенд). Клиент считает объявление отредактированным, если `updated_at - created_at > 60s`.

Типы WS-уведомлений ленты (строки `data.type`):

- `"Объявление курса"`
- `"Материал курса"`, `"Добавлен материал курса"`, `"Удалён материал курса"`, `"Изменён материал курса"`

Диплинк в `notification.link`: `/courses/{uuid}/announcements` или `/courses/{uuid}/feed`.

### 8.4. Обсуждение темы (чат, не лента курса)

```ts
type FeedItem = {
  id: string;
  user: { user_id: number; name: string; avatar: string };
  theme: string;
  text: string;
  created_at: Date;
  replies?: FeedItem[];
  likes?: number;
};

type ThemeFaq = {
  id: string;
  question: string;
  theme: string;
  answer: string;
};
```

FAQ: `GET faq/{theme}/` на бэкенде может вернуть **все** FAQ. Клиент фильтрует `faq.theme === theme`.

### 8.5. Тесты

```ts
type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "essay";

type QuestionCorrectAnswer = string | string[] | boolean | null;

type Test = {
  id: string;
  title: string;
  description: string;
  opening_date: string;
  max_points: number;
  min_points?: number;
  status: boolean;
  result: number | null;
  comment?: string | null;
  passed?: boolean | null;
  needsReview?: boolean | null;
  is_open: boolean | null;
};

type TestOption = {
  id: string;
  text: string;
  image: string | null;
  order: number;
  is_correct?: boolean;          // не отдавать студенту при прохождении
};

type TestQuestion = {
  id: string;
  question: string;
  questionImage: string | null;
  questionAudio: string | null;
  questionVideo: string | null;
  multipleAnswers: boolean;
  questionType?: QuestionType;
  correctAnswer?: QuestionCorrectAnswer;
  options: TestOption[];
};

type TestDetails = {
  id: string;
  title: string;
  description: string;
  showCorrectAnswers: boolean;
  maxPoints: number;
  minPoints?: number;
  timeLimit: number;             // минуты
  required: boolean;
  opening_date: string;
  courseIds: string[];
  questions: TestQuestion[];
};

type TestAnswer = {
  questionId: string;
  selectedOptions?: string[];    // id опций
  textAnswer?: string;
};

type TestSubmissionPayload = {
  answers: TestAnswer[];
  timeRemaining?: number;        // секунды
  showCorrectAnswers?: boolean;
};

type TestSubmissionResponse = {
  score?: number;
  maxPoints?: number;
  minPoints?: number;
  passed?: boolean;
  needsReview?: boolean;
  pendingReview?: number;
  resultId?: string;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  timeSpent?: number;
  completionDate?: string;
  detailedResults?: Array<{
    questionId: string;
    questionText: string;
    questionType?: QuestionType | string;
    questionImage: string | null;
    selectedOptions: Array<{ id: string; text: string }>;
    correctOptions: Array<{ id: string; text: string }>;
    textAnswer?: string;
    isCorrect: boolean | null;
    needsReview?: boolean;
    comment?: string | null;
  }>;
};

type TestResult = {
  id?: number | string;
  name: string;
  group: string;
  user_id?: number;
  student_id?: number;
  result: number | null;
  result_id?: string | null;
  comment?: string | null;
  passed?: boolean | null;
  needsReview?: boolean | null;
  avatar: string;
  answers?: Array<{
    questionId: string;
    questionType?: QuestionType | string;
    questionText?: string;
    textAnswer?: string;
    selectedOptions?: Array<string | { id: string; text: string }>;
    correctOptions?: Array<string | { id: string; text: string }>;
    isCorrect?: boolean | null;
    isSkipped?: boolean;
    needsReview?: boolean;
    comment?: string | null;
    points?: number | null;
  }>;
};

/** Студент может начать тест только если: */
const studentCanTakeTest = (t: Test) =>
  t.passed == null && t.needsReview !== true && t.is_open === true;
```

Подписи типов вопросов: «Один вариант», «Несколько вариантов», «Верно/неверно», «Короткий ответ», «Развёрнутый ответ».

`essay` не имеет эталона — уходит на ручную проверку (`needsReview`).

### 8.6. Банк вопросов

```ts
type BankQuestion = {
  id: string;
  question: string;
  questionImagePreview?: string;
  options: Array<{ id?: string; text: string; imagePreview?: string }>;
  correctAnswer: QuestionCorrectAnswer;
  multipleAnswers: boolean;
  questionType: QuestionType;
};

type QuestionBank = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  questions: BankQuestion[];
  questionsCount?: number;
};

type CreateBankPayload = { name: string; description: string };
```

Правильный ответ сравнивается **по тексту варианта**, не по id.

Клиент принимает и camelCase, и snake_case (`question_type`, `created_at`, `image_preview`).

### 8.7. Пользователь, файлы, избранное, уведомления

```ts
type UserProfileData = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  avatar: string;
  is_employee: boolean;
  position: string;
  group: string;
  email: string;
  number_phone: string;
  telegram_username: string;
  bio: string;
  custom_permission: string[];
  username?: string;
  birth_date?: string | null;
  gender?: string | null;
  institute_name?: string | null;
  employments?: UserEmployment[];
};

type UserFilesList = {
  id: string;
  file: string;
  file_names: string;
  resides: {
    course: Array<{ id: string; discipline_name: string }>;
    theme: Array<{ id: string; title: string }>;
  };
};

type UserGroupList = {
  id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  avatar: string;
  is_employee: true;
  position: string;
  group: string;
};

type Favorites = {
  themes: CourseDetail[];
  courses: Course[];
};

type Notification = {
  id: string;
  address_id: number;
  text: string;
  link: string;
  status: boolean;              // true = прочитано
  created_at: string;
  sender_id: number;
  type: string;
  sender_first_name: string;
  sender_last_name: string;
};

type ProfilePayload = {
  avatar?: string;
  bio?: string;
  number_phone?: string;
  telegram_username?: string;
};

type FavoritePayload = { theme?: string; course?: string };
```

### 8.8. Remarks

```ts
enum RemarkStatus {
  PENDING = "pending",       // ждёт студента
  RESPONDED = "responded",   // студент ответил, ждёт препода
  APPROVED = "approved",     // архив
  REJECTED = "rejected",     // нужно исправить
}

type RemarksListType = "actual" | "archive";

type RemarkMessage = {
  id: string;
  remark_id: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  sender_role: "teacher" | "student";
  message: string;
  created_at: string | Date;
};

type Remark = {
  id: string;
  course_id: string;
  title?: string;
  course_name: string;
  theme_id: string;
  theme_title: string;
  student_id: number;
  student_name: string;
  student_avatar: string;
  student_group: string;
  teacher_id: number;
  teacher_name: string;
  teacher_avatar: string;
  status: RemarkStatus;
  messages: RemarkMessage[];
  messages_count?: string | number;
  last_message?: string;
  created_at: string | Date;
  updated_at: string | Date;
  archived_at?: string | Date | null;
  pending_remarks?: number;
  submission_id?: string | null;
  submission_version?: number | null;
};

type CreateRemarkPayload = {
  theme_id: string;
  student_id: number;
  title: string;
  message: string;
  submission_id?: string;
};
```

Машина статусов:

```
teacher create → pending
student message → responded
teacher approve → approved (архив)
teacher reject  → rejected  (цикл: студент снова пишет → responded)
```

### 8.9. Прочее

```ts
type CourseStream = {
  id: string;
  course: string;
  stream_id: string;
  title: string;
};

type CourseInviteLink = {
  link: string;
  course_id?: string;
  link_id?: string;
};

type Faculty = {
  id: number;
  title_faculty: string;
  abbreviation_faculty: string;
  department: Array<{
    id: number;
    departament_name: string;
    abbreviation: string | null;
    phone_number: string;
    institute: number;
  }>;
};

type SearchBar = {
  courses: Course[];
  employees: UserGroupList[];
  files: UserFilesList[];
  study_tasks: StudyTask[];
};

type StudyTask = {
  id: string;
  week: string;
  title: string;
  type_less: string;
  max_points: number;
  deadline: string | null;
  status: boolean | null;
  locked: boolean;
  open_date: string | null;
  description: string | null;
  discipline_name: string;
  is_favorite: boolean;
  result: number | null;
};
```

---

## 9. Каталог API

Полные URL = `baseURL` инстанса + путь. Auth: cookie + `X-Profile-Context`, кроме явно публичных.

### 9.1. Auth — `$api_auth` / raw axios — `…/users/api/v1/`

См. [§3.2](#32-эндпоинты-auth).

### 9.2. Курсы — `$api_edu` = `…/educations/api/v1/edu/`

| # | Метод | Путь | Query / body | Ответ | Кто |
|---|-------|------|--------------|-------|-----|
| 1 | GET | `course-theme/{courseId}/` | — | `CourseAllMaterials` | все участники |
| 2 | GET | `course-detail/{themeId}/` | — | `{ data: CourseMaterials[] }` клиент берёт `.data` | все |
| 3 | GET | `answer-task/{themeId}/` | — | `StudentsAnswers[]` | teacher |
| 4 | GET | `student-task-files/{themeId}/` | — | `FileAnswer[]` | студент (свои файлы) |
| 5 | GET | `faq/{themeId}/` | — | `ThemeFaq[]` (фильтровать по theme) | все |
| 6 | GET | `table-performance/{courseId}/` | — | `TablePerfomance[]` | teacher |
| 7 | GET | `table-performance/{courseId}/export/` | `responseType: blob`, Accept spreadsheet | файл xlsx | teacher |
| 8 | GET | `my-submissions/{courseId}/` | — | `MySubmissionsResponse` | студент |
| 9 | GET | `course-announcements/{courseId}/` | — | `CourseAnnouncement[]` | все |
| 10 | GET | `course-feed/{courseId}/` | `sort`, `kind` | `CourseFeedItem[]` или обёртка | все |
| 11 | POST | `course-announcements/{courseId}/` | `{ text, is_pinned? }` | `CourseAnnouncement` | teacher |
| 12 | PATCH | `course-announcements/{courseId}/{announcementId}/` | `{ text?, is_pinned? }` | `CourseAnnouncement` | author/teacher |
| 13 | DELETE | `course-announcements/{courseId}/{announcementId}/` | — | — | author/teacher |
| 14 | GET | `course-materials/{courseId}/` | `search?` | `CourseMaterialFile[]` | все |
| 15 | GET | `modules/{courseId}/` | — | `CourseModulesResponse` | все |
| 16 | GET | `thems/{weekId}/` | — | `WeekTheme[]` | (редко, старый UI модулей) |
| 17 | POST | `course/` | `{ discipline_name, organization_id, organization_name }` | курс | teacher |
| 18 | POST | `course-detail/` | `CreateThemePayload` | тема | teacher |
| 19 | PATCH | `course-detail/{themeId}/` | `EditThemePayload` | тема | teacher |
| 20 | DELETE | `course-detail/{themeId}/` | — | — | teacher |
| 21 | POST | `faq/` | `{ question, theme, answer }` | FAQ | teacher |
| 22 | POST | `material/` | multipart | материал | teacher |
| 23 | POST | `answer-task/` | multipart | сдача | студент |
| 24 | POST | `is_read-file/` | `{ file: fileId }` | — | все (просмотр файла) |
| 25 | POST | `scoring/` | `RateAnswerPayload` | — | teacher |
| 26 | PATCH | `partial-locked-task/{themeId}/` | `{ locked, users?, groups? }` | — | teacher |
| 27 | PATCH | `course-theme/{courseId}/` | `{ audience?, requirements?, description?, organization_id?, organization_name? }` | — | owner/teacher |
| 28 | DELETE | `course/{id}` | **без** `/` | — | owner |
| 29 | DELETE | `material/{id}/` | — | — | owner |
| 30 | DELETE | `student-task-files/{fileId}/` | — | — | студент (свой файл) |
| 31 | POST | `finish-course/` | `{ course_id, status, user_id }` | — | teacher |
| 32 | POST | `extra-points/` | `{ course?, points?, reason?, user_id? }` | — | teacher |
| 33 | GET | `course-streams/` | `course_id` | `CourseStream[]` | teacher |
| 34 | POST | `course-streams/` | `{ course, title, streams: [{ title, stream }] }` | — | teacher |
| 35 | DELETE | `course-streams/{id}/` | — | — | teacher |
| 36 | GET | `testing/` | `course_id?` | `Test[]` | все (в контексте курса) / teacher bank |
| 37 | GET | `course-link/{courseId}/` | — | invite; **404 → null** | teacher |
| 38 | POST | `course-link/` | `{ course_id, duration }` duration ISO-8601 или `null` | invite | teacher |
| 39 | DELETE | `course-link/{courseId}/` | — | — | teacher |
| 40 | GET | `list-course-register/` | — | `Course[]` открытые курсы | все |

`CreateThemePayload`:

```ts
{
  course?: string;
  week: number;
  title?: string;
  type_less: string;
  max_points?: number;
  deadline: string;        // ISO
  locked: boolean;
  open_date: string;       // ISO
  description?: string;
  test_id?: string;
}
```

`EditThemePayload`: все поля опциональны (`title`, `week`, `type_less`, `max_points`, `deadline`, `locked`, `open_date`, `description`).

Дубль курса `duplicateCourse` — **клиентский mock**, HTTP нет.

### 9.3. LMS users — `$api_users` = `…/educations/api/v1/users/`

| # | Метод | Путь | Body | Ответ |
|---|-------|------|------|-------|
| 1 | GET | `my-courses/` | — | `Course[]` |
| 2 | POST | `registration-course/` | `{ course_id }` или `{ course_id, link_id }` | join |
| 3 | DELETE | `remove/{courseId}/{studentId}/` | — | исключить студента |
| 4 | GET | `user/{id}/` | — | `UserProfileData` |
| 5 | PATCH | `user/{id}/` | FormData или JSON | профиль |
| 6 | GET | `files/{id}/` | — | `UserFilesList[]` |
| 7 | GET | `my-team/{group}/` | — | `UserGroupList[]` |
| 8 | GET | `favorites/` | — | `Favorites` |
| 9 | POST | `favorites/` | `{ theme? }` или `{ course? }` | — |
| 10 | DELETE | `favorites/?type=course\|theme&id={id}` | — | — |
| 11 | GET | `api/v1/achievements/` | — | `AchievementList` (путь вложен дважды относительно base) |

Join: 400/409 + текст «уже состоит / already enrolled» → клиент показывает «Вы уже состоите в этом курсе» и открывает курс.

### 9.4. Чаты и remarks — `$api_base_edu` = `…/educations/api/`

| # | Метод | Путь | Body | Ответ |
|---|-------|------|------|-------|
| 1 | GET | `v1/chats/discussion/{themeId}/` | — | `FeedItem[]` |
| 2 | POST | `v1/chats/discussion/` | `{ theme, text }` | комментарий |
| 3 | POST | `v1/chats/discussion/reply/` | `{ comment_id, text }` | reply |
| 4 | POST | `v1/chats/discussion/like/` | `{ comment_id }` | — |
| 5 | GET | `v1/remarks/` | `type=actual\|archive` | `Remark[]` |
| 6 | POST | `v1/remarks/` | `CreateRemarkPayload` | `Remark` |
| 7 | GET | `v1/remarks/{id}/` | — | `Remark` |
| 8 | POST | `v1/remarks/{id}/messages/` | `{ message }` | `RemarkMessage` |
| 9 | PATCH | `v1/remarks/{id}/status/` | `{ status }` | `Remark` |
| 10 | GET | `v1/remarks/theme/{themeId}/` | — | `Remark[]` (студент по теме) |
| 11 | GET | `v1/remarks/theme/{themeId}/student/{studentId}/` | — | `Remark[]` (teacher) |
| 12 | GET | `v1/global-search/?search=` | — | `SearchBar` |
| 13 | GET | `v1/quizzes/{quizId}/` | — | legacy quiz |
| 14 | POST | `v1/quiz-results/` | `QuizResult` | legacy |
| 15 | POST | `v1/quizzes/` | `QuizPayload` | legacy create (raw axios, **без** interceptors) |

**Основной тестовый контур — `testing/`, не `v1/quizzes/`.** Страница создания теста пишет в `POST testing/` multipart. `v1/quizzes` — старый код, для нового клиента не использовать.

Гостевой поиск: `GET {API_URL}v1/global-search?search=` без interceptors, `withCredentials: true`.

### 9.5. Тесты — `$api_edu`

| # | Метод | Путь | Body | Ответ |
|---|-------|------|------|-------|
| 1 | GET | `testing/` | `course_id?` | `Test[]` |
| 2 | GET | `testing/{id}/` | — | `TestDetails` |
| 3 | GET | `results/{testId}/{courseId}/` | — | `TestResult[]` |
| 4 | POST | `testing/` | JSON `TestPayload` **или** multipart | `TestDetails` |
| 5 | PUT | `testing/{id}/` | JSON или multipart | `TestDetails` |
| 6 | DELETE | `testing/{id}/` | — | void |
| 7 | POST | `tests/{testId}/submit/` | `TestSubmissionPayload` | `TestSubmissionResponse` |
| 8 | POST | `tests/attach-to-course/` | `{ test_id, course_id }` | `{ message, course_id, test_id, is_open }` |
| 9 | PATCH | `tests/{testId}/availability/` | `{ course_id, is_open }` | `{ test_id, course_id, is_open }` |
| 10 | POST | `tests/{testId}/reset-result/` | `{ student_id, course_id }` | reset payload |

Создание теста (как на вебе) — **multipart**:

Поле `data` = JSON:

```json
{
  "title": "…",
  "description": "…",
  "opening_date": "ISO",
  "required": false,
  "timeLimit": 60,
  "maxPoints": 100,
  "minPoints": 60,
  "showCorrectAnswers": false,
  "questions": [
    {
      "question": "…",
      "questionType": "single_choice",
      "multipleAnswers": false,
      "correctAnswer": "Протокол",
      "options": [{ "text": "Протокол", "is_correct": true }, { "text": "Язык", "is_correct": false }]
    }
  ]
}
```

Файлы:

- `questions[{q}][questionImage]`
- `questions[{q}][options][{o}][image]`

### 9.6. Банк вопросов — `$api_edu`

| Метод | Путь | Body | Ответ |
|-------|------|------|-------|
| GET | `question-banks/` | — | `QuestionBank[]` или `{ results }` |
| POST | `question-banks/` | `{ name, description }` | банк, нужен `id` |
| GET | `question-banks/{id}/` | — | банк + questions |
| DELETE | `question-banks/{id}/` | — | 204 |
| POST | `question-banks/{id}/questions/` | multipart | `BankQuestion` |
| PUT | `question-banks/{id}/questions/{qid}/` | multipart | `BankQuestion` |
| DELETE | `question-banks/{id}/questions/{qid}/` | — | void |

Multipart вопроса:

| Поле | Значение |
|------|----------|
| `question` | текст |
| `questionType` | enum |
| `multipleAnswers` | `"true"` / `"false"` |
| `correctAnswer` | строка, `"true"`/`"false"`, или JSON-массив; нет для essay |
| `options` | JSON `[{ id?, text }]` только для choice |
| `questionImage` | file optional |
| `optionImage_{index}` | file optional |

Вставка вопроса из банка в тест — **копия на клиенте**, отдельного API нет.

### 9.7. Уведомления — `$api_notification` = `…/edu-service/`

| Метод | Путь | Body | Ответ |
|-------|------|------|-------|
| GET | `notifications/` | — | `Notification[]` |
| PATCH | `notifications/{id}/` | `{ status: true }` | — |

WS: `wss://uadmin.kstu.kg/edu-service/ws/notification/{numericUserId}/`

Сообщение JSON: как минимум `type`, `text`, `link`. При close ≠ 1000 веб переподключается через 5 с.

### 9.8. Университет — `$api2` = `…/educations/api/`

| Метод | Путь | Ответ |
|-------|------|-------|
| GET | `institutes-dep` | `Faculty[]` (без `/`) |
| GET | `department-employees/{id}` | `Employee[]` |

Экран `/universities` есть, в основной навигации нет.

---

## 10. Логика экранов и вызовы бэкенда

### 10.1. Логин

1. Форма: `username` + `password` → `POST users/auth`.
2. Google → `id_token` → `POST users/auth/google`.
3. Если `requiresContextSelection` — два варианта Сотрудник/Студент → `POST users/auth/context`.
4. Успех → курсы или invite.
5. Bootstrap: refresh cookie; если на `/` уже есть сессия — сразу внутрь.

Ошибки: тост «Ошибка авторизации: {message}».

### 10.2. Список курсов `/courses`

- `GET my-courses/`
- Карточка: название `discipline_name`, владелец, прогресс, баллы, число студентов, избранное.
- Тап → экран курса с `courseId`.
- Teacher: карточка «Добавить курс» → `POST course/` `{ discipline_name, organization_id, organization_name }`. Организация берётся из профиля/кафедры.
- Аватар владельца → чужой профиль `/profile/{user_id}`.

### 10.3. Курс — оболочка

Параллельно:

| Запрос | Зачем |
|--------|--------|
| `GET modules/{id}/` | название, владельцы |
| `GET course-theme/{id}/` | темы + мета |
| `GET testing/?course_id=` | тесты курса |
| `GET course-feed/{id}/` | счётчик ленты |
| `GET course-materials/{id}/` | счётчик материалов |
| студент: `GET my-submissions/{id}/` | вкладка сдач |
| teacher: `GET table-performance/{id}/` | журнал |

Вкладки:

| value | Название | Кто | UI |
|-------|----------|-----|-----|
| `study_proccess` | Учебный процесс | все | список тем+тестов + workspace |
| `feed` | Лента курса | все | лента; teacher CRUD объявлений |
| `course_materials` | Материалы | все | плоский список файлов, поиск, переход в тему |
| `my_submissions` | Мои сдачи | студент | таблица по темам |
| `about_course` | О курсе | все | description / audience / requirements; owner edit |
| `students_progress` | Успеваемость студентов | teacher | журнал + Excel |
| `course_management` | Управление курсом | teacher | потоки, кафедра, duplicate (mock) |

Teacher: кнопка QR рядом с названием.

Диплинк `?tab=feed` открывает ленту.

### 10.4. Учебный процесс

Левая колонка (на мобилке — первый экран): темы из `course-theme.detail` + тесты из `testing/?course_id=`. Тесты показываются как пункт с `type_less: "Тесты"`.

Группировка по `type_less`.

**Студент тап по теме** → workspace темы.

**Студент тап по тесту:**

- `studentCanTakeTest` → экран прохождения (`GET testing/{id}/`).
- иначе (закрыт / сдан / на проверке) — не стартовать.

**Teacher тап по теме** → тот же workspace.

**Teacher тап по тесту** → панель редактора: доступность, результаты, сброс, удаление, привязка.

Teacher: создать тему (`POST course-detail/`), редактировать/удалить тему, прикрепить существующий тест (`POST tests/attach-to-course/`).

Тема `locked: true` — закрыта для студентов (кроме выданных через `partial-locked-task`).

### 10.5. Workspace темы

Вкладки:

| value | Студент | Teacher | API |
|-------|---------|---------|-----|
| `theme_answers` | «Мои файлы»: загрузка + версии | «Список студентов»: все сдачи, оценка, remarks, исключение | student: `student-task-files/{theme}/`; teacher: `answer-task/{theme}/` |
| (в той же вкладке сверху) | материалы | материалы + upload/delete | `course-detail/{theme}/` |
| `feed` | обсуждение | обсуждение | `v1/chats/discussion/{theme}/` |
| `faq` | просмотр | + создать | `faq/{theme}/`, `POST faq/` |
| `comments` | свои замечания по теме | нет (глобальный `/remarks`) | `v1/remarks/theme/{theme}/` |

Материалы: `POST material/` multipart:

```
file: File
description: file.name (или произвольное)
course_detail: themeId
url?: optional string
```

Альтернативная форма ещё шлёт `url`.

Сдача студента:

```
list_files[0], list_files[1], …  — файлы
task: themeId
```

Оценка: `POST scoring/` `{ answer: submissionOrFileId, points, comment }`. Комментарий один раз: если уже есть — только показ, не перезапись в UI.

Прочитан файл: `POST is_read-file/` `{ file }`.

Удалить свой файл: `DELETE student-task-files/{id}/`.

Исключить студента: `DELETE remove/{courseId}/{studentId}/`.

Создать замечание из карточки студента: `POST v1/remarks/` `{ theme_id, student_id, title, message, submission_id? }`.

### 10.6. Лента курса

`GET course-feed/{id}/?sort=desc&kind=all`

Фильтры UI: все / объявления / материалы.

Teacher: форма `{ text, is_pinned }` → POST. Edit/delete если `can_manage`.

Realtime: WS инвалидирует feed + announcements.

Если `GET course-feed` ещё нет на стенде — веб умеет собирать ленту из объявлений + текущих файлов (без истории удалений). Предпочитать feed.

### 10.7. Материалы курса

`GET course-materials/{id}/?search=`

Группировка визуально по `theme`. Тап по теме → учебный процесс с открытой темой. Файл — открыть/скачать URL `file`.

### 10.8. Мои сдачи

`GET my-submissions/{courseId}/`

Колонки: тема, тип, дедлайн, статус, балл, комментарий, версия.

Статусы: Сдано / Не сдано / Просрочено. Если сдано после дедлайна — пометка опоздания. `points == null && submitted` → «На проверке».

Тап → тема. Блок extra_points отдельно.

### 10.9. О курсе

Поля из `course-theme` / `modules`: `description`, `audience`, `requirements`, владельцы.

Редактирование owner: `PATCH course-theme/{id}/`.

### 10.10. Успеваемость

`GET table-performance/{id}/` — строки студенты, ячейки баллы по темам.

Excel: `GET …/export/` blob. 403 → скрыть кнопку.

Тап по студенту → деталка (на вебе диалог, внутри ещё mock-статистика курса — не путать с живым журналом).

Итог курса: `POST finish-course/` + опционально `POST extra-points/` (веб вызывает оба из одной формы).

### 10.11. Управление курсом

- Потоки: GET/POST/DELETE `course-streams/`
- Смена кафедры: `PATCH course-theme/{id}/` `{ organization_id, organization_name }`
- Duplicate: **не вызывать API**, на вебе timeout-заглушка

QR:

```
GET course-link/{courseId}/     // 404 = ссылки нет
POST course-link/ { course_id, duration }
DELETE course-link/{courseId}/
```

`duration`: `P1D` | `P3D` | `P7D` | `P30D` | `P365D` | `null`.

Публичная ссылка: `{origin}/course/{courseId}/{linkId}/invite`.

Ответ GET/POST нормализуют: `link` / `url` / `invite_link` + uuid `course_id`, `link_id`.

### 10.12. Приглашение

1. Распарсить `courseId` + `linkId`.
2. Нет сессии → логин, сохранить ids, после входа вернуться.
3. `GET my-courses/` — если курс уже есть, кнопка «Перейти».
4. Иначе карточка + «Вступить»: `POST registration-course/` `{ course_id, link_id }`.
5. Уже участник (400/409) → открыть курс.
6. Успех → invalidate курсы → список/курс.

`GET modules/{id}/` для названия на карточке (retry: false).

### 10.13. Прохождение теста

1. `GET testing/{id}/`.
2. Таймер: `timeLimit` минут, `timeRemaining` в секундах на submit.
3. Типы: radio / checkbox / true-false / text / textarea.
4. Submit: `POST tests/{id}/submit/` `{ answers, timeRemaining, showCorrectAnswers }`.
5. Результат с клиента (state), не отдельный GET. Экран результата: score, passed, needsReview, detailedResults если `showCorrectAnswers`.
6. Назад в курс.

Нельзя выходить из попытки нижним таббаром.

### 10.14. Тесты преподавателя

Список: `GET testing/` без course_id — все тесты автора.

Создание: multipart §9.5. Редактирование: `PUT testing/{id}/` тот же формат.

В курсе:

- открыть/закрыть: `PATCH tests/{id}/availability/`
- результаты: `GET results/{testId}/{courseId}/`
- сброс попытки: `POST tests/{id}/reset-result/` `{ student_id, course_id }`
- удалить: `DELETE testing/{id}/`
- оценка эссе: `POST scoring/` с `questionId` / `result`

### 10.15. Банк вопросов

Студентов редиректить. Список/CRUD §9.6. Деталка — вопросы, редактор как у теста.

### 10.16. Профиль

Свой: `GET users/me` + `GET user/{numericId}/` + `GET files/{id}/`.

Чужой: только `GET user/{id}/`, вкладки файлов нет.

Правка: FormData `avatar` | `bio` | `number_phone` | `telegram_username` → `PATCH user/{id}/`.

Выход: `POST users/auth/logout` + очистка storage.

### 10.17. Уведомления

`GET notifications/`. Непрочитанные: `status === false`. Тап: `PATCH … { status: true }`, переход по `link`.

Лента/объявление → курс с вкладкой feed.

### 10.18. Remarks глобально

`GET v1/remarks/?type=actual` и `archive`.

Teacher: группировка по студентам, чат, approve/reject.

Студент: свои треды. Ответ: `POST …/messages/`.

Тема студента: `GET v1/remarks/theme/{themeId}/`.

---

## 11. Загрузки и скачивания

| Действие | Content-Type | Поля |
|----------|--------------|------|
| Материал темы | multipart | `file`, `description`, `course_detail`, `url?` |
| Сдача | multipart | `list_files[i]`, `task` |
| Тест create/update | multipart | `data` JSON + картинки вопросов |
| Вопрос банка | multipart | см. §9.6 |
| Аватар/профиль | multipart | `avatar` / текстовые поля |
| Excel ведомость | GET blob | проверить MIME: json/html = ошибка, не файл |
| Учебный файл / сдача | GET URL | `file` с бэкенда, часто `/media/...` |

На проде абсолютные URL media обычно с `uadmin.kstu.kg`. Локально — относительные `/media/...`.

---

## 12. Realtime-уведомления

После логина: `wss://uadmin.kstu.kg/edu-service/ws/notification/{userId}/`

`userId` — **number** из сессии, не UUID `UsersMe.id`.

На сообщение:

1. Toast.
2. Обновить список уведомлений.
3. Если type/link про ленту — обновить feed/announcements курса.

Авторизация WS на вебе — только URL с id (cookies браузера). На мобилке может понадобиться тот же cookie jar для wss или уточнение у бэкенда, если handshake не пройдёт.

---

## 13. Поиск

`GET …/api/v1/global-search/?search={q}` (authed)  
или без trailing slash для гостя.

Ответ `SearchBar`. Навигация:

- course → открыть курс
- study_tasks → курс+тема (тема = `id` задания)
- employees → профиль `user_id`
- files → скачать / открыть

---

## 14. Замечания (remarks)

Не путать с обсуждением темы (`v1/chats/discussion`) и лентой курса (`course-feed`).

Remarks — приватный тред teacher↔student по теме/сдаче.

Где в UI:

- Teacher: карточка студента в теме + страница `/remarks`
- Student: вкладка темы «Замечания» + `/remarks`

`/remarks` в шапке нет — вход из темы или прямой URL. В мобилке логично: бейдж в теме + inbox в профиле.

---

## 15. Тесты и банк вопросов

Два контура, для мобилки нужен **один**:

| Контур | Префикс | Используется |
|--------|---------|--------------|
| LMS tests | `/api/v1/edu/testing/`, `/api/v1/edu/tests/` | да, основной |
| Legacy quiz | `/api/v1/quizzes/` | нет в живом UI создания |

Вопросы банка копируются в черновик теста без связи id.

Оценка авто: choice / true_false / short_answer. Essay → `needsReview`, teacher `scoring`.

---

## 16. Известные заглушки и пробелы

| Тема | Статус | Для мобилки |
|------|--------|-------------|
| Статистика `/statistic` | JSON-моки, HTTP нет | не реализовывать как API |
| Биллинг `/billing` | статичный UI | нет |
| Группы `/groups` | API закомментирован | нет |
| Duplicate course | setTimeout mock | нет |
| `v1/quizzes` | мёртвый код | не использовать |
| Посещаемость | удалена с фронта | нет |
| Ручная оценка без файла | есть в бэклоге (`docs/FEATURE_PROMPTS.md` §3), **в текущем клиенте эндпоинта нет** | не выдумывать |
| Достижения | `GET …/achievements/` есть, вкладка профиля почти не торчит | опционально |
| Избранное | API есть | опционально |
| Footer | не смонтирован | — |
| Trailing slash `DELETE course/{id}` | без `/` | копировать как есть |

Планировалось, уже есть на клиенте: комментарий к оценке, «Мои сдачи», плоские материалы, Excel, объявления, лента с журналом файлов.

---

## 17. Чеклист для мобильного агента

### Инфраструктура

- [ ] Cookie jar + `withCredentials` на все хосты (`educations`, `users`, `edu-service`)
- [ ] Заголовок `X-Profile-Context`
- [ ] CSRF на write к users-service
- [ ] Single-flight refresh на 401
- [ ] Trailing slashes как в таблице
- [ ] Нормализация списков (array | results | items | data)
- [ ] camelCase тестов и snake_case остального

### MVP студент

- [ ] Логин / Google / выбор контекста / logout
- [ ] Список курсов
- [ ] Курс: процесс, лента, материалы, мои сдачи, о курсе
- [ ] Тема: материалы, загрузка ответа, обсуждение, FAQ, замечания
- [ ] Invite join
- [ ] Прохождение теста + результат
- [ ] Уведомления REST + WS
- [ ] Профиль
- [ ] Поиск

### MVP преподаватель (поверх студенческого)

- [ ] Создание курса и темы
- [ ] Upload/delete материалов
- [ ] Список сдач, scoring + comment
- [ ] Журнал + Excel
- [ ] QR invite
- [ ] CRUD объявлений
- [ ] Тесты: CRUD, attach, availability, results, reset
- [ ] Банк вопросов
- [ ] Remarks create / approve / reject
- [ ] Потоки, исключение студента

### Не тащить с веба

- Hidden IDs / sessionStorage UUID
- Статистику-моки, биллинг, groups stub, duplicate mock
- `v1/quizzes`
- FSD-структуру папок — только контракт API и экраны

### Диплинки, которые стоит поддержать

```
/course/{courseId}/{linkId}/invite
/courses/invite?course_id=&link_id=
/courses/{courseId}/feed
/courses/{courseId}/announcements
```

После логина, если сохранён invite — сразу экран вступления.

---

## Приложение A. Справочник payload’ов курса

```ts
type CreateCoursePayload = {
  discipline_name: string;
  organization_id: string;
  organization_name: string;
};

type FinishCoursePayload = {
  course_id: string;
  status: boolean;
  user_id: number;
};

type ExtraPointPayload = {
  course?: string;
  points?: number;
  reason?: string;
  user_id?: number;
};

type CreateFAQPayload = {
  question: string;
  theme: string;
  answer: string;
};

type editPermissionPayload = {
  locked: boolean;
  users?: number[];
  groups?: string[];
};

type BindCourseStreamsPayload = {
  course: string;
  title: string;
  streams: Array<{ title: string; stream: string }>;
};

type CreateCourseInvitePayload = {
  course_id: string;
  duration: string | null;
};

type RegisterToCoursePayload = {
  course_id: string;
  link_id: string;
};
```

## Приложение B. Исходники веба (если нужно свериться)

| Что | Файл |
|-----|------|
| Роуты | `src/shared/config/routeConfig/routeConfig.tsx` |
| Axios bases | `src/shared/api/config.ts`, `api-target.ts` |
| Auth | `src/shared/lib/auth/*` |
| Course API | `src/entities/Course/model/services/courseAPI.ts` |
| Course types | `src/entities/Course/model/types/course.ts` |
| Test API | `src/entities/Test/model/services/testAPI.ts` |
| Remarks API | `src/entities/Remarks/model/services/remarksAPI.ts` |
| User API | `src/entities/User/model/userAPI.ts` |
| Question bank | `src/entities/QuestionBank/model/services/questionBankAPI.ts` |
| Course shell | `src/entities/Course/ui/CourseDetails.tsx` |
| Theme workspace | `src/entities/Course/ui/Themes2/ThemeWorkspace.tsx` |
| Hidden ids (не копировать) | `src/shared/lib/navigation/hidden-ids.ts` |

Документ отражает клиент на момент составления. Если бэкенд добавит ручную оценку без файла или mobile-token — сверяйте `courseAPI.ts` и users-service, а не только этот файл.
