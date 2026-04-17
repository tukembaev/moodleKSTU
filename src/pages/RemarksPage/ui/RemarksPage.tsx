import { useQuery } from "@tanstack/react-query";
import {
  ArchiveSection,
  Remark,
  RemarkList,
  RemarkStatus,
  remarksQueries,
  StudentList,
  StudentRemarkSummary,
} from "entities/Remarks";
import { useCallback, useMemo, useState } from "react";
import {
  LuArchive,
  LuArrowLeft,
  LuBell,
  LuCircleCheck,
  LuLayoutGrid,
  LuList,
  LuMessageSquareWarning,
  LuSearch,
} from "react-icons/lu";
import { useAuth } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";

const RemarksPage = () => {
  const authData = useAuth();

  const currentUser = useMemo(() => {
    if (!authData) {
      return null;
    }
    const fullName =
      `${authData.last_name ?? ""} ${authData.first_name ?? ""}`.trim() ||
      authData.email ||
      "";
    return {
      id: authData.id,
      name: fullName,
      role: (authData.isStudent ? "student" : "teacher") as
        | "student"
        | "teacher",
      avatar: authData.avatar || "",
    };
  }, [authData]);

  const [selectedStudent, setSelectedStudent] =
    useState<StudentRemarkSummary | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "expanded">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: activeRemarksData,
    isLoading: isActiveLoading,
  } = useQuery(remarksQueries.list("actual"));
  const {
    data: archivedRemarksData,
    isLoading: isArchiveLoading,
  } = useQuery(remarksQueries.list("archive"));

  const remarks: Remark[] = useMemo(
    () => activeRemarksData ?? [],
    [activeRemarksData]
  );
  const archivedRemarks: Remark[] = useMemo(
    () => archivedRemarksData ?? [],
    [archivedRemarksData]
  );

  // Мутации
  const { mutate: addMessage } = remarksQueries.add_message();
  const { mutate: updateStatus } = remarksQueries.update_status();

  // Агрегируем сводку по студентам из активных замечаний (для учителя)
  const studentSummaries: StudentRemarkSummary[] = useMemo(() => {
    const map = new Map<number, StudentRemarkSummary>();
    remarks.forEach((r) => {
      const existing = map.get(r.student_id);
      if (existing) {
        existing.total_remarks += 1;
        if (r.status === RemarkStatus.PENDING) existing.pending_remarks += 1;
        if (r.status === RemarkStatus.RESPONDED)
          existing.responded_remarks += 1;
        const course = existing.courses.find(
          (c) => c.course_id === r.course_id
        );
        if (course) {
          course.remarks_count += 1;
        } else {
          existing.courses.push({
            course_id: r.course_id,
            course_name: r.course_name,
            remarks_count: 1,
          });
        }
      } else {
        map.set(r.student_id, {
          student_id: r.student_id,
          student_name: r.student_name,
          student_avatar: r.student_avatar,
          student_group: r.student_group,
          total_remarks: 1,
          pending_remarks: r.status === RemarkStatus.PENDING ? 1 : 0,
          responded_remarks: r.status === RemarkStatus.RESPONDED ? 1 : 0,
          courses: [
            {
              course_id: r.course_id,
              course_name: r.course_name,
              remarks_count: 1,
            },
          ],
        });
      }
    });
    return Array.from(map.values());
  }, [remarks]);

  // Фильтрация активных замечаний по выбранному студенту / поиску / роли
  const filteredRemarks = useMemo(() => {
    if (!currentUser) return [];
    let filtered = remarks.filter((r) => r.status !== RemarkStatus.APPROVED);

    if (currentUser.role === "student") {
      filtered = filtered.filter((r) => r.student_id === currentUser.id);
    } else if (selectedStudent) {
      filtered = filtered.filter(
        (r) => r.student_id === selectedStudent.student_id
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.theme_title.toLowerCase().includes(query) ||
          r.course_name.toLowerCase().includes(query) ||
          r.student_name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [remarks, currentUser, selectedStudent, searchQuery]);

  const filteredArchivedRemarks = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "student") {
      return archivedRemarks.filter((r) => r.student_id === currentUser.id);
    }
    return archivedRemarks;
  }, [archivedRemarks, currentUser]);

  const stats = useMemo(() => {
    if (!currentUser)
      return { total: 0, pending: 0, responded: 0, rejected: 0, archived: 0 };
    const activeRemarks = remarks.filter(
      (r) => r.status !== RemarkStatus.APPROVED
    );
    const userRemarks =
      currentUser.role === "student"
        ? activeRemarks.filter((r) => r.student_id === currentUser.id)
        : activeRemarks;

    return {
      total: userRemarks.length,
      pending: userRemarks.filter((r) => r.status === RemarkStatus.PENDING)
        .length,
      responded: userRemarks.filter(
        (r) => r.status === RemarkStatus.RESPONDED
      ).length,
      rejected: userRemarks.filter((r) => r.status === RemarkStatus.REJECTED)
        .length,
      archived: filteredArchivedRemarks.length,
    };
  }, [remarks, currentUser, filteredArchivedRemarks]);

  // ----- Handlers -----

  const handleSendMessage = useCallback(
    (remarkId: string, message: string, _files: File[]) => {
      if (!message.trim()) return;
      addMessage({ id: remarkId, data: { message } });
    },
    [addMessage]
  );

  const handleApprove = useCallback(
    (remarkId: string) => {
      updateStatus({
        id: remarkId,
        data: { status: RemarkStatus.APPROVED },
      });
    },
    [updateStatus]
  );

  const handleReject = useCallback(
    (remarkId: string, reason: string) => {
      addMessage(
        { id: remarkId, data: { message: reason } },
        {
          onSuccess: () => {
            updateStatus({
              id: remarkId,
              data: { status: RemarkStatus.REJECTED },
            });
          },
        }
      );
    },
    [addMessage, updateStatus]
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Требуется авторизация для просмотра замечаний
        </p>
      </div>
    );
  }

  const isLoading = isActiveLoading || isArchiveLoading;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Замечания
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentUser.role === "teacher"
                ? "Управление замечаниями по работам студентов"
                : "Ваши замечания и требования к исправлению"}
            </p>
          </div>

          {/* View controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center rounded-lg border bg-muted/30 p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-1.5 h-8"
              >
                <LuList className="h-4 w-4" />
                <span className="hidden sm:inline">Список</span>
              </Button>
              <Button
                variant={viewMode === "expanded" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("expanded")}
                className="gap-1.5 h-8"
              >
                <LuLayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Развёрнуто</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/50">
                  <LuBell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">
                    Ожидает ответа
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/50">
                  <LuMessageSquareWarning className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.responded}</p>
                  <p className="text-xs text-muted-foreground">На проверке</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/50">
                  <LuMessageSquareWarning className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">
                    На исправлении
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
                  <LuCircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.archived}</p>
                  <p className="text-xs text-muted-foreground">В архиве</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              <LuMessageSquareWarning className="h-4 w-4" />
              Текущие
              {stats.total > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="archive" className="gap-2">
              <LuArchive className="h-4 w-4" />
              Архив
              {stats.archived > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.archived}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {currentUser.role === "teacher" && !selectedStudent && (
            <div className="relative w-full sm:w-72">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск студентов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>

        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : currentUser.role === "teacher" ? (
            selectedStudent ? (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedStudent(null)}
                  className="gap-2"
                >
                  <LuArrowLeft className="h-4 w-4" />
                  Назад к списку студентов
                </Button>
                <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-muted/30 border">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {selectedStudent.student_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.student_group} •{" "}
                      {selectedStudent.total_remarks} замечаний
                    </p>
                  </div>
                </div>
                <RemarkList
                  remarks={filteredRemarks}
                  currentUserId={currentUser.id}
                  currentUserRole={currentUser.role}
                  onSendMessage={handleSendMessage}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  viewMode={viewMode}
                />
              </div>
            ) : (
              <StudentList
                students={studentSummaries}
                remarks={remarks}
                onSelectStudent={setSelectedStudent}
              />
            )
          ) : (
            <RemarkList
              remarks={filteredRemarks}
              currentUserId={currentUser.id}
              currentUserRole={currentUser.role}
              onSendMessage={handleSendMessage}
              viewMode={viewMode}
            />
          )}
        </TabsContent>

        <TabsContent value="archive" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <ArchiveSection
              archivedRemarks={filteredArchivedRemarks}
              studentSummaries={studentSummaries}
              currentUserId={currentUser.id}
              currentUserRole={currentUser.role}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RemarksPage;
