import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  BookText,
  Building2,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  FolderOpen,
  Home,
  Layers,
  ListChecks,
  Pencil,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  compareRu,
  coursesCountLabel,
  DepartmentCourseTypeStat,
  DepartmentTeacherCourse,
  departmentQueries,
  filesCountLabel,
  matchesQuery,
  personInitials,
} from "entities/Department";
import { openCourse } from "shared/lib/navigation/hidden-ids";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { DepartmentCards } from "./DepartmentCards";
import {
  WorkloadBackBar,
  WorkloadCardSkeleton,
  WorkloadEmpty,
  WorkloadError,
  WorkloadListSkeleton,
  WorkloadSearch,
} from "./workload-shared";

const THEME_TYPE_ICONS: Record<string, LucideIcon> = {
  lb: FlaskConical,
  pr: Pencil,
  lc: BookOpen,
  srs: Home,
  rgz: FileSpreadsheet,
  rgr: ClipboardList,
  umk: FolderOpen,
  gl: BookText,
  sb: FileText,
  test: ListChecks,
  other: Layers,
};

interface WorkloadCatalogProps {
  departmentId: string | null;
  onSelectDepartment: (id: string) => void;
  onBack: () => void;
}

export function WorkloadCatalog({
  departmentId,
  onSelectDepartment,
  onBack,
}: WorkloadCatalogProps) {
  if (departmentId) {
    return <TeachersPanel departmentId={departmentId} onBack={onBack} />;
  }

  return <DepartmentsPanel onSelectDepartment={onSelectDepartment} />;
}

function DepartmentsPanel({
  onSelectDepartment,
}: {
  onSelectDepartment: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const { data, isLoading, error } = useQuery(departmentQueries.list());
  const departments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((item) => matchesQuery(item.name, q));
  }, [data, query]);

  if (isLoading) return <WorkloadCardSkeleton />;
  if (error) {
    return (
      <WorkloadError
        message={
          error instanceof Error ? error.message : t("Неизвестная ошибка")
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <WorkloadSearch
        value={query}
        onChange={setQuery}
        placeholder={t("Поиск кафедры...")}
      />
      {departments.length === 0 ? (
        <WorkloadEmpty
          icon={<Building2 />}
          title={query ? t("Кафедры не найдены") : t("Кафедр пока нет")}
          description={
            query
              ? t("Попробуйте другое название")
              : t(
                  "Как только появятся курсы с кафедрой, список заполнится здесь"
                )
          }
        />
      ) : (
        <DepartmentCards
          departments={departments}
          onSelect={(department) => onSelectDepartment(department.id)}
        />
      )}
    </div>
  );
}

function TeachersPanel({
  departmentId,
  onBack,
}: {
  departmentId: string;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [openTeacher, setOpenTeacher] = useState("");
  const departmentsQuery = useQuery(departmentQueries.list());
  const teachersQuery = useQuery(departmentQueries.teachers(departmentId));
  const department = departmentsQuery.data?.find(
    (item) => item.id === departmentId
  );
  const teachers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...(teachersQuery.data ?? [])]
      .filter(
        (teacher) =>
          matchesQuery(teacher.name, q) ||
          matchesQuery(teacher.position, q) ||
          matchesQuery(teacher.last_name, q)
      )
      .sort((a, b) => compareRu(a.name, b.name));
  }, [teachersQuery.data, query]);

  const title = department?.name ?? t("Кафедра");

  return (
    <div className="space-y-4">
      <WorkloadBackBar
        title={title}
        subtitle={t("Преподаватели кафедры")}
        onBack={onBack}
      />
      <WorkloadSearch
        value={query}
        onChange={setQuery}
        placeholder={t("Поиск преподавателя...")}
      />
      {teachersQuery.isLoading ? (
        <WorkloadListSkeleton />
      ) : teachersQuery.error ? (
        <WorkloadError
          message={
            teachersQuery.error instanceof Error
              ? teachersQuery.error.message
              : t("Неизвестная ошибка")
          }
        />
      ) : teachers.length === 0 ? (
        <WorkloadEmpty
          icon={query ? <Search /> : <Users />}
          title={
            query
              ? t("Преподаватели не найдены")
              : t("На кафедре нет преподавателей")
          }
          description={
            query
              ? t("Попробуйте фамилию или должность")
              : t("Курсы этой кафедры пока ни за кем не закреплены")
          }
        />
      ) : (
        <Accordion
          type="single"
          collapsible
          value={openTeacher}
          onValueChange={setOpenTeacher}
          className="overflow-hidden rounded-2xl border"
        >
          {teachers.map((teacher) => {
            const value = String(teacher.id);
            return (
              <AccordionItem key={teacher.id} value={value} className="px-1">
                <AccordionTrigger className="items-center px-3 py-3 hover:no-underline hover:bg-accent/50">
                  <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Avatar className="size-10 rounded-xl">
                      <AvatarImage
                        src={teacher.avatar ?? undefined}
                        alt={teacher.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-xl text-xs font-semibold">
                        {personInitials(teacher.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {teacher.name}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {teacher.position || t("Преподаватель")}
                        {teacher.files_count > 0
                          ? ` · ${filesCountLabel(teacher.files_count)}`
                          : ""}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
                      {coursesCountLabel(teacher.courses_count)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-3">
                  {openTeacher === value ? (
                    <TeacherCourses
                      departmentId={departmentId}
                      teacherId={teacher.id}
                    />
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

function TeacherCourses({
  departmentId,
  teacherId,
}: {
  departmentId: string;
  teacherId: number;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const coursesQuery = useQuery(
    departmentQueries.teacherCourses(departmentId, teacherId)
  );
  const courses = coursesQuery.data ?? [];
  const goToCourse = (courseId: string) => openCourse(navigate, courseId);

  if (coursesQuery.isLoading) return <WorkloadListSkeleton rows={3} />;
  if (coursesQuery.error) {
    return (
      <WorkloadError
        message={
          coursesQuery.error instanceof Error
            ? coursesQuery.error.message
            : t("Неизвестная ошибка")
        }
      />
    );
  }
  if (courses.length === 0) {
    return (
      <WorkloadEmpty
        icon={<BookOpen />}
        title={t("Нет дисциплин")}
        description={t(
          "На этой кафедре за преподавателем пока не закреплены курсы"
        )}
      />
    );
  }

  return (
    <Accordion type="single" collapsible className="rounded-xl border bg-muted/20">
      {courses.map((course) => (
        <AccordionItem key={course.id} value={course.id} className="px-1">
          <AccordionTrigger className="items-center px-3 py-3 hover:no-underline">
            <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-sm font-semibold">
                {(course.discipline_name || "?").trim().charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  role="link"
                  tabIndex={0}
                  className="block w-fit max-w-full truncate font-medium underline underline-offset-4 decoration-foreground/35 hover:decoration-foreground cursor-pointer"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    goToCourse(course.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    event.stopPropagation();
                    goToCourse(course.id);
                  }}
                >
                  {course.discipline_name}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {filesCountLabel(course.files_count)}
                </span>
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <CourseTypeCards course={course} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function CourseTypeCards({ course }: { course: DepartmentTeacherCourse }) {
  const { t } = useTranslation();
  const types = Array.isArray(course.by_type) ? course.by_type : [];

  if (types.length === 0) {
    return (
      <p className="px-1 py-2 text-sm text-muted-foreground">
        {t("В курсе пока нет тем")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {types.map((item) => (
        <TypeStatCard key={`${course.id}-${item.type}`} item={item} />
      ))}
    </div>
  );
}

function TypeStatCard({ item }: { item: DepartmentCourseTypeStat }) {
  const Icon = THEME_TYPE_ICONS[item.type] ?? Layers;
  const empty = item.files_count === 0;

  return (
    <div
      title={item.label}
      className={cn(
        "flex min-h-[5.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-medium",
        empty
          ? "border-input bg-transparent text-muted-foreground"
          : "border-input bg-background text-foreground"
      )}
    >
      <Icon className="size-4" />
      <span className="text-center leading-tight">{item.short_label}</span>
      <span
        className={cn(
          "tabular-nums text-sm font-semibold",
          empty ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {item.files_count}
      </span>
    </div>
  );
}
