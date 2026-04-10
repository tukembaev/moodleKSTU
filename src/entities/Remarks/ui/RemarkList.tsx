import { useState, useMemo } from "react";
import {
  LuSearch,
  LuFilter,
  LuMessageSquarePlus,
  LuInbox,
  LuListFilter,
} from "react-icons/lu";
import { Input } from "shared/shadcn/ui/input";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Badge } from "shared/shadcn/ui/badge";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { cn } from "shared/lib/utils";
import { Remark, RemarkStatus, RemarkType } from "entities/Remarks/model/types/remarks";
import RemarkChat from "./RemarkChat";
import RemarkItem from "./RemarkItem";

interface RemarkListProps {
  remarks: Remark[];
  currentUserId: number;
  currentUserRole: "teacher" | "student";
  onSendMessage?: (remarkId: string, message: string, files: File[]) => void;
  onApprove?: (remarkId: string) => void;
  onReject?: (remarkId: string, reason: string) => void;
  viewMode?: "list" | "expanded";
  className?: string;
}

const RemarkList = ({
  remarks,
  currentUserId,
  currentUserRole,
  onSendMessage,
  onApprove,
  onReject,
  viewMode = "list",
  className,
}: RemarkListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRemark, setSelectedRemark] = useState<Remark | null>(null);
  const [statusFilters, setStatusFilters] = useState<RemarkStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<RemarkType | null>(null);

  const filteredRemarks = useMemo(() => {
    return remarks.filter((remark) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        remark.theme_title.toLowerCase().includes(searchLower) ||
        remark.course_name.toLowerCase().includes(searchLower) ||
        remark.student_name.toLowerCase().includes(searchLower) ||
        remark.teacher_name.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(remark.status);

      // Type filter
      const matchesType = !typeFilter || remark.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [remarks, searchQuery, statusFilters, typeFilter]);

  const toggleStatusFilter = (status: RemarkStatus) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const statusStats = useMemo(() => {
    return {
      pending: remarks.filter((r) => r.status === RemarkStatus.PENDING).length,
      responded: remarks.filter((r) => r.status === RemarkStatus.RESPONDED).length,
      rejected: remarks.filter((r) => r.status === RemarkStatus.REJECTED).length,
    };
  }, [remarks]);

  const clearFilters = () => {
    setStatusFilters([]);
    setTypeFilter(null);
    setSearchQuery("");
  };

  const hasActiveFilters =
    statusFilters.length > 0 || typeFilter !== null || searchQuery.length > 0;

  if (selectedRemark && viewMode === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        <Button
          variant="ghost"
          onClick={() => setSelectedRemark(null)}
          className="gap-2"
        >
          ← Назад к списку
        </Button>
        <RemarkChat
          remark={selectedRemark}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onSendMessage={onSendMessage}
          onApprove={onApprove}
          onReject={onReject}
          isExpanded={true}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск замечаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <LuFilter className="h-4 w-4" />
                Статус
                {statusFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {statusFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Фильтр по статусу</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes(RemarkStatus.PENDING)}
                onCheckedChange={() => toggleStatusFilter(RemarkStatus.PENDING)}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Ожидает ответа
                  <Badge variant="outline" className="ml-auto">
                    {statusStats.pending}
                  </Badge>
                </span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes(RemarkStatus.RESPONDED)}
                onCheckedChange={() => toggleStatusFilter(RemarkStatus.RESPONDED)}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  На проверке
                  <Badge variant="outline" className="ml-auto">
                    {statusStats.responded}
                  </Badge>
                </span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes(RemarkStatus.REJECTED)}
                onCheckedChange={() => toggleStatusFilter(RemarkStatus.REJECTED)}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Требует исправления
                  <Badge variant="outline" className="ml-auto">
                    {statusStats.rejected}
                  </Badge>
                </span>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <LuListFilter className="h-4 w-4" />
                Тип
                {typeFilter && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Фильтр по типу</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={typeFilter === RemarkType.TEXT}
                onCheckedChange={(checked) =>
                  setTypeFilter(checked ? RemarkType.TEXT : null)
                }
              >
                Текстовые
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilter === RemarkType.FILE}
                onCheckedChange={(checked) =>
                  setTypeFilter(checked ? RemarkType.FILE : null)
                }
              >
                К файлу
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {/* Remarks list */}
      {filteredRemarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-2xl bg-muted/50 mb-4">
            <LuInbox className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <h3 className="font-semibold text-lg mb-1">
            {hasActiveFilters ? "Ничего не найдено" : "Нет замечаний"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {hasActiveFilters
              ? "Попробуйте изменить параметры поиска или сбросить фильтры"
              : currentUserRole === "teacher"
              ? "Все работы студентов в порядке! Создавайте замечания при проверке работ."
              : "У вас пока нет замечаний от преподавателей. Продолжайте в том же духе!"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Сбросить фильтры
            </Button>
          )}
        </div>
      ) : viewMode === "expanded" ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 pr-4">
            {filteredRemarks.map((remark) => (
              <RemarkChat
                key={remark.id}
                remark={remark}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                onSendMessage={onSendMessage}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-3 pr-4">
            {filteredRemarks.map((remark) => (
              <RemarkItem
                key={remark.id}
                remark={remark}
                currentUserRole={currentUserRole}
                onClick={() => setSelectedRemark(remark)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default RemarkList;
