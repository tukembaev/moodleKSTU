import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import {
  LuMessageSquare,
  LuPaperclip,
  LuFile,
  LuChevronDown,
  LuCheck,
  LuX,
  LuClock,
  LuCircleAlert,
  LuSend,
  LuUpload,
} from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Textarea } from "shared/shadcn/ui/textarea";
import { Input } from "shared/shadcn/ui/input";
import { cn } from "shared/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/shadcn/ui/collapsible";
import {
  Remark,
  RemarkMessage,
  RemarkStatus,
  RemarkType,
} from "entities/Remarks/model/types/remarks";

interface RemarkChatProps {
  remark: Remark;
  currentUserId: number;
  currentUserRole: "teacher" | "student";
  onSendMessage?: (remarkId: string, message: string, files: File[]) => void;
  onApprove?: (remarkId: string) => void;
  onReject?: (remarkId: string, reason: string) => void;
  isExpanded?: boolean;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const RemarkChat = ({
  remark,
  currentUserId,
  currentUserRole,
  onSendMessage,
  onApprove,
  onReject,
  isExpanded = false,
  className,
}: RemarkChatProps) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const [newMessage, setNewMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      onSendMessage?.(remark.id, newMessage, selectedFiles);
      setNewMessage("");
      setSelectedFiles([]);
    }
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject?.(remark.id, rejectReason);
      setRejectReason("");
      setShowRejectInput(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const getStatusBadge = (status: RemarkStatus) => {
    switch (status) {
      case RemarkStatus.PENDING:
        return (
          <Badge className="gap-1.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
            <LuClock className="h-3 w-3" />
            Ожидает ответа
          </Badge>
        );
      case RemarkStatus.RESPONDED:
        return (
          <Badge className="gap-1.5 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
            <LuMessageSquare className="h-3 w-3" />
            Ожидает проверки
          </Badge>
        );
      case RemarkStatus.APPROVED:
        return (
          <Badge className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
            <LuCheck className="h-3 w-3" />
            Одобрено
          </Badge>
        );
      case RemarkStatus.REJECTED:
        return (
          <Badge className="gap-1.5 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">
            <LuCircleAlert className="h-3 w-3" />
            Требует исправления
          </Badge>
        );
    }
  };

  const renderMessage = (message: RemarkMessage, index: number) => {
    const isCurrentUser = message.sender_id === currentUserId;
    const isTeacher = message.sender_role === "teacher";

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm">
          <AvatarImage src={message.sender_avatar} />
          <AvatarFallback
            className={cn(
              "text-xs font-medium",
              isTeacher
                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
            )}
          >
            {getInitials(message.sender_name)}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "flex flex-col gap-1.5 max-w-[75%]",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {message.sender_name}
            </span>
            <span className="text-xs text-muted-foreground/60">
              {format(message.created_at, "d MMM, HH:mm", { locale: ru })}
            </span>
          </div>

          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
              isCurrentUser
                ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-md"
                : "bg-muted/80 text-foreground rounded-bl-md border border-border/50"
            )}
          >
            {message.message}
          </div>

          {message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {message.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.file_url}
                  download={attachment.file_name}
                  className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted border border-border/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <LuFile className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {attachment.file_name}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const canRespond =
    (currentUserRole === "student" &&
      (remark.status === RemarkStatus.PENDING ||
        remark.status === RemarkStatus.REJECTED)) ||
    (currentUserRole === "teacher" &&
      remark.status === RemarkStatus.RESPONDED);

  const canApproveReject =
    currentUserRole === "teacher" && remark.status === RemarkStatus.RESPONDED;

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4",
        remark.status === RemarkStatus.PENDING && "border-l-amber-500",
        remark.status === RemarkStatus.RESPONDED && "border-l-blue-500",
        remark.status === RemarkStatus.APPROVED && "border-l-emerald-500",
        remark.status === RemarkStatus.REJECTED && "border-l-rose-500",
        className
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm truncate">
                    {remark.theme_title}
                  </h4>
                  {remark.type === RemarkType.FILE && (
                    <Badge
                      variant="outline"
                      className="gap-1 text-xs shrink-0"
                    >
                      <LuPaperclip className="h-3 w-3" />
                      К файлу
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {remark.course_name}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {format(remark.created_at, "d MMMM yyyy", { locale: ru })}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="flex items-center gap-1">
                    <LuMessageSquare className="h-3 w-3" />
                    {remark.messages.length}{" "}
                    {remark.messages.length === 1 ? "сообщение" : "сообщений"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {getStatusBadge(remark.status)}
                <LuChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-in slide-in-from-top-2 duration-200">
          <CardContent className="pt-0 pb-4 space-y-4">
            {/* Original file for FILE type remarks */}
            {remark.type === RemarkType.FILE && remark.original_file && (
              <div className="p-3 rounded-xl bg-muted/40 border border-dashed border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Файл с замечанием:
                </p>
                <a
                  href={remark.original_file.file_url}
                  download={remark.original_file.file_name}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-muted transition-colors border"
                >
                  <LuFile className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {remark.original_file.file_name}
                  </span>
                </a>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto px-1 scrollbar-thin">
              {remark.messages.map((message, index) =>
                renderMessage(message, index)
              )}
            </div>

            {/* Teacher actions for RESPONDED remarks */}
            {canApproveReject && (
              <div className="pt-4 border-t border-border/50 space-y-3">
                {!showRejectInput ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onApprove?.(remark.id)}
                      className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    >
                      <LuCheck className="h-4 w-4" />
                      Одобрить
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowRejectInput(true)}
                      className="flex-1 gap-2"
                    >
                      <LuX className="h-4 w-4" />
                      Отклонить
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    <Textarea
                      placeholder="Укажите причину отклонения..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectInput(false)}
                        className="flex-1"
                      >
                        Отмена
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={!rejectReason.trim()}
                        className="flex-1 gap-2"
                      >
                        <LuSend className="h-4 w-4" />
                        Отправить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reply input for student or teacher */}
            {canRespond && (
              <div className="pt-4 border-t border-border/50 space-y-3">
                <Textarea
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="resize-none min-h-[80px]"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id={`file-upload-${remark.id}`}
                      className="hidden"
                      multiple
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById(`file-upload-${remark.id}`)
                          ?.click()
                      }
                      className="gap-2"
                    >
                      <LuUpload className="h-4 w-4" />
                      Прикрепить
                    </Button>
                    {selectedFiles.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {selectedFiles.length} файл(ов) выбрано
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && selectedFiles.length === 0}
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                  >
                    <LuSend className="h-4 w-4" />
                    Отправить
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RemarkChat;
