import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RemarksList, remarkQueries } from "../../../entities/Remarks";
import { RemarkStatus } from "../../../entities/Remarks/model/types/remarks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/shadcn/ui/select";
import { Input } from "../../../shared/shadcn/ui/input";
import { useAuth } from "shared/hooks";

interface Filters {
  search: string;
  author: string;
  course: string;
  assignment: string;

  status: RemarkStatus | "all";
}

const RemarksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"open" | "archive">("open");
  const auth = useAuth();

  const currentUserId = auth?.id || 0;
  const currentUserRole: "teacher" | "student" = auth?.isStudent ? "student" : "teacher";

  // Получаем все данные с API для обоих типов
  const { data: actualRemarksData = [] } = useQuery(remarkQueries.allRemarks("actual"));
  const { data: archiveRemarksData = [] } = useQuery(remarkQueries.allRemarks("archive"));

  // Состояние фильтров
  const [filters, setFilters] = useState<Filters>({
    search: "",
    author: "all",
    course: "all",
    assignment: "all",
    status: "all",
  });

  // Объединяем все данные для фильтрации
  const allRemarks = useMemo(() => [...actualRemarksData, ...archiveRemarksData], [actualRemarksData, archiveRemarksData]);

  // Извлечение уникальных значений для фильтров
  const filterOptions = useMemo(() => {
    const authors = new Set<string>();
    const courses = new Set<string>();
    const assignments = new Set<string>();

    allRemarks.forEach((remark) => {
      authors.add(remark.student_name);
      courses.add(remark.course_name);
      assignments.add(remark.title);
    });

    return {
      authors: Array.from(authors),
      courses: Array.from(courses),
      assignments: Array.from(assignments),
    };
  }, [allRemarks]);

  // Подсчет количества для табов (из всех данных с учетом фильтров)
  const counts = useMemo(() => {
    const allFiltered = allRemarks.filter((remark) => {
      // Применяем базовые фильтры
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!(
          remark.title.toLowerCase().includes(searchLower) ||
          remark.student_name.toLowerCase().includes(searchLower) ||
          remark.course_name.toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      if (filters.author !== "all" && remark.student_name !== filters.author) {
        return false;
      }

      if (filters.course !== "all" && remark.course_name !== filters.course) {
        return false;
      }

      if (filters.assignment !== "all" && remark.title !== filters.assignment) {
        return false;
      }

      if (filters.status !== "all" && remark.status !== filters.status) {
        return false;
      }

      return true;
    });

    return {
      open: allFiltered.filter((r) => r.status !== RemarkStatus.APPROVED).length,
      archive: allFiltered.filter((r) => r.status === RemarkStatus.APPROVED).length,
    };
  }, [allRemarks, filters]);

  // Финальный список для отображения (фильтруем по активному табу)
  const displayedRemarks = useMemo(() => {
    const remarksForTab = activeTab === "open" ? actualRemarksData : archiveRemarksData;
    return remarksForTab.filter((remark) => {
      // Применяем базовые фильтры
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!(
          remark.title.toLowerCase().includes(searchLower) ||
          remark.student_name.toLowerCase().includes(searchLower) ||
          remark.course_name.toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      if (filters.author !== "all" && remark.student_name !== filters.author) {
        return false;
      }

      if (filters.course !== "all" && remark.course_name !== filters.course) {
        return false;
      }

      if (filters.assignment !== "all" && remark.title !== filters.assignment) {
        return false;
      }

      if (filters.status !== "all" && remark.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [activeTab, actualRemarksData, archiveRemarksData, filters]);

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      search: "",
      author: "all",
      course: "all",
      assignment: "all",
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
      <div>
        {/* Page Header */}
        <div className="mb-4">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
            Замечания
          </h2>
          <p className="mt-1.5 text-lg text-muted-foreground">
            {auth?.isStudent ? 'Управление замечаниями по работам' : 'Управление замечаниями по работам студентов'}
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
