import {
  ArchiveSection,
  mockArchivedRemarks,
  mockCurrentUser,
  mockRemarks,
  mockStudentSummaries,
  Remark,
  RemarkList,
  RemarkMessage,
  RemarkStatus,
  StudentList,
  StudentRemarkSummary
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
  LuUsers,
} from "react-icons/lu";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";

const RemarksPage = () => {
  // For demo purposes - toggle between teacher and student view
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [remarks, setRemarks] = useState<Remark[]>(mockRemarks);
  const [archivedRemarks, setArchivedRemarks] = useState<Remark[]>(mockArchivedRemarks);
  const [selectedStudent, setSelectedStudent] = useState<StudentRemarkSummary | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "expanded">("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter remarks based on user role and selected student
  const filteredRemarks = useMemo(() => {
    let filtered = remarks.filter((r) => r.status !== RemarkStatus.APPROVED);

    if (currentUser.role === "student") {
      filtered = filtered.filter((r) => r.student_id === currentUser.id);
    } else if (selectedStudent) {
      filtered = filtered.filter((r) => r.student_id === selectedStudent.student_id);
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

  // Filter archived remarks
  const filteredArchivedRemarks = useMemo(() => {
    if (currentUser.role === "student") {
      return archivedRemarks.filter((r) => r.student_id === currentUser.id);
    }
    return archivedRemarks;
  }, [archivedRemarks, currentUser]);

  // Stats
  const stats = useMemo(() => {
    const activeRemarks = remarks.filter((r) => r.status !== RemarkStatus.APPROVED);
    const userRemarks =
      currentUser.role === "student"
        ? activeRemarks.filter((r) => r.student_id === currentUser.id)
        : activeRemarks;

    return {
      total: userRemarks.length,
      pending: userRemarks.filter((r) => r.status === RemarkStatus.PENDING).length,
      responded: userRemarks.filter((r) => r.status === RemarkStatus.RESPONDED).length,
      rejected: userRemarks.filter((r) => r.status === RemarkStatus.REJECTED).length,
      archived: filteredArchivedRemarks.length,
    };
  }, [remarks, currentUser, filteredArchivedRemarks]);

  // Handlers
  const handleSendMessage = useCallback(
    (remarkId: string, message: string, files: File[]) => {
      setRemarks((prev) =>
        prev.map((remark) => {
          if (remark.id !== remarkId) return remark;

          const newMessage: RemarkMessage = {
            id: `msg-${Date.now()}`,
            remark_id: remarkId,
            sender_id: currentUser.id,
            sender_name: currentUser.name,
            sender_avatar: currentUser.avatar,
            sender_role: currentUser.role,
            message,
            attachments: files.map((file, i) => ({
              id: `attach-${Date.now()}-${i}`,
              file_name: file.name,
              file_url: URL.createObjectURL(file),
              file_size: file.size,
              uploaded_at: new Date(),
            })),
            created_at: new Date(),
          };

          return {
            ...remark,
            messages: [...remark.messages, newMessage],
            status:
              currentUser.role === "student"
                ? RemarkStatus.RESPONDED
                : remark.status,
            updated_at: new Date(),
          };
        })
      );
    },
    [currentUser]
  );

  const handleApprove = useCallback((remarkId: string) => {
    setRemarks((prev) => {
      const remarkToArchive = prev.find((r) => r.id === remarkId);
      if (remarkToArchive) {
        setArchivedRemarks((archived) => [
          ...archived,
          {
            ...remarkToArchive,
            status: RemarkStatus.APPROVED,
            archived_at: new Date(),
          },
        ]);
      }
      return prev.filter((r) => r.id !== remarkId);
    });
  }, []);

  const handleReject = useCallback(
    (remarkId: string, reason: string) => {
      setRemarks((prev) =>
        prev.map((remark) => {
          if (remark.id !== remarkId) return remark;

          const rejectMessage: RemarkMessage = {
            id: `msg-${Date.now()}`,
            remark_id: remarkId,
            sender_id: currentUser.id,
            sender_name: currentUser.name,
            sender_avatar: currentUser.avatar,
            sender_role: "teacher",
            message: reason,
            attachments: [],
            created_at: new Date(),
          };

          return {
            ...remark,
            messages: [...remark.messages, rejectMessage],
            status: RemarkStatus.REJECTED,
            updated_at: new Date(),
          };
        })
      );
    },
    [currentUser]
  );

  const toggleUserRole = () => {
    setCurrentUser((prev) =>
      prev.role === "teacher"
        ? { id: 101, name: "Иванов Александр Петрович", role: "student", avatar: "" }
        : mockCurrentUser
    );
    setSelectedStudent(null);
  };

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

          {/* Demo toggle and view controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleUserRole}
              className="gap-2"
            >
              <LuUsers className="h-4 w-4" />
              {currentUser.role === "teacher" ? "Режим студента" : "Режим учителя"}
            </Button>
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
                  <p className="text-xs text-muted-foreground">Ожидает ответа</p>
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
                  <p className="text-xs text-muted-foreground">На исправлении</p>
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

          {/* Search for teacher with student list */}
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
          {currentUser.role === "teacher" ? (
            // Teacher view: student list or selected student's remarks
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
                    <p className="font-semibold">{selectedStudent.student_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.student_group} • {selectedStudent.total_remarks} замечаний
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
                students={mockStudentSummaries}
                remarks={remarks}
                onSelectStudent={setSelectedStudent}
              />
            )
          ) : (
            // Student view: remarks feed
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
          <ArchiveSection
            archivedRemarks={filteredArchivedRemarks}
            studentSummaries={mockStudentSummaries}
            currentUserId={currentUser.id}
            currentUserRole={currentUser.role}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RemarksPage;
