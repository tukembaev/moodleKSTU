import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { RemarksList } from "../../../entities/Remarks";
import { mockRemarks, mockArchivedRemarks } from "../../../entities/Remarks/model/mocks/remarksMock";
import { RemarkStatus, RemarkType } from "../../../entities/Remarks/model/types/remarks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/shadcn/ui/select";
import { Input } from "../../../shared/shadcn/ui/input";

interface Filters {
  search: string;
  author: string;
  course: string;
  assignment: string;
  type: RemarkType | "all";
  status: RemarkStatus | "all";
}

const RemarksPage: React.FC = () => {
  // TODO: Заменить на реальные данные из API
  const [currentUserId] = useState(1);
  const [currentUserRole] = useState<"teacher" | "student">("teacher");
  const [activeTab, setActiveTab] = useState<"open" | "archive">("open");

  // Состояние фильтров
  const [filters, setFilters] = useState<Filters>({
    search: "",
    author: "all",
    course: "all",
    assignment: "all",
    type: "all",
    status: "all",
  });

  // Объединяем все замечания (открытые и архивные)
  const allRemarks = useMemo(() => [...mockRemarks, ...mockArchivedRemarks], []);

  // Извлечение уникальных значений для фильтров
  const filterOptions = useMemo(() => {
    const authors = new Set<string>();
    const courses = new Set<string>();
    const assignments = new Set<string>();

    allRemarks.forEach((remark) => {
      authors.add(remark.student_name);
      courses.add(remark.course_name);
      assignments.add(remark.theme_title);
    });

    return {
      authors: Array.from(authors),
      courses: Array.from(courses),
      assignments: Array.from(assignments),
    };
  }, [allRemarks]);

  // Базовая фильтрация (без учета таба)
  const filteredRemarksBase = useMemo(() => {
    let result = allRemarks;

    // Поиск
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.theme_title.toLowerCase().includes(searchLower) ||
          r.student_name.toLowerCase().includes(searchLower) ||
          r.course_name.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по автору
    if (filters.author !== "all") {
      result = result.filter((r) => r.student_name === filters.author);
    }

    // Фильтр по курсу
    if (filters.course !== "all") {
      result = result.filter((r) => r.course_name === filters.course);
    }

    // Фильтр по заданию
    if (filters.assignment !== "all") {
      result = result.filter((r) => r.theme_title === filters.assignment);
    }

    // Фильтр по типу
    if (filters.type !== "all") {
      result = result.filter((r) => r.type === filters.type);
    }

    // Фильтр по статусу
    if (filters.status !== "all") {
      result = result.filter((r) => r.status === filters.status);
    }

    return result;
  }, [allRemarks, filters]);

  // Подсчет количества для табов
  const counts = useMemo(() => {
    return {
      open: filteredRemarksBase.filter((r) => r.status !== RemarkStatus.APPROVED).length,
      archive: filteredRemarksBase.filter((r) => r.status === RemarkStatus.APPROVED).length,
    };
  }, [filteredRemarksBase]);

  // Финальный список для отображения (с учетом таба)
  const displayedRemarks = useMemo(() => {
    if (activeTab === "open") {
      return filteredRemarksBase.filter((r) => r.status !== RemarkStatus.APPROVED);
    } else {
      return filteredRemarksBase.filter((r) => r.status === RemarkStatus.APPROVED);
    }

  }, [filteredRemarksBase, activeTab]);

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      search: "",
      author: "all",
      course: "all",
      assignment: "all",
      type: "all",
      status: "all",
    });
  };

  // Компонент фильтров
  const filtersContent = (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
      {/* Поисковая строка */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Поиск замечаний..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9 w-full"
        />
      </div>

      {/* Сетка фильтров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full">
        {/* Фильтр по автору */}
        <Select
          value={filters.author}
          onValueChange={(value) => setFilters({ ...filters, author: value })}

        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Автор" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все авторы</SelectItem>
            {filterOptions.authors.map((author) => (
              <SelectItem key={author} value={author}>
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Фильтр по курсу */}
        <Select
          value={filters.course}
          onValueChange={(value) => setFilters({ ...filters, course: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Курс" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все курсы</SelectItem>
            {filterOptions.courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Фильтр по заданию */}
        <Select
          value={filters.assignment}
          onValueChange={(value) => setFilters({ ...filters, assignment: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Задание" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все задания</SelectItem>
            {filterOptions.assignments.map((assignment) => (
              <SelectItem key={assignment} value={assignment}>
                {assignment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Фильтр по типу */}
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value as RemarkType | "all" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value={RemarkType.TEXT}>Текст</SelectItem>
            <SelectItem value={RemarkType.FILE}>Файл</SelectItem>
          </SelectContent>
        </Select>

        {/* Фильтр по статусу */}
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value as RemarkStatus | "all" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value={RemarkStatus.PENDING}>Ожидает ответа</SelectItem>
            <SelectItem value={RemarkStatus.RESPONDED}>Отвечено</SelectItem>
            <SelectItem value={RemarkStatus.REJECTED}>Отклонено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Кнопка сброса (если есть активные фильтры) */}
      {(filters.search ||
        filters.author !== "all" ||
        filters.course !== "all" ||
        filters.assignment !== "all" ||
        filters.type !== "all" ||
        filters.status !== "all") && (
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className=" px-2 py-8 ">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Замечания</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Управление замечаниями по работам студентов
          </p>
        </div>

        {/* Remarks List with Filters */}
        <RemarksList
          remarks={displayedRemarks}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showTabs={true}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          filters={filtersContent}
          openCount={counts.open}
          archiveCount={counts.archive}
        />
      </div>
    </div>
  );
};

export default RemarksPage;
