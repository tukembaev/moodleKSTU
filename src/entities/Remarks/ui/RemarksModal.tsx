import React, { useState } from "react";
import { X, File, Download, Send, Paperclip } from "lucide-react";
import { Remark, RemarkStatus, RemarkType, RemarkMessage } from "../model/types/remarks";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "shared/shadcn/ui/dialog";

interface RemarksModalProps {
    remark: Remark;
    currentUserId?: number;
    currentUserRole?: "teacher" | "student";
    onClose: () => void;
    onUpdate: (updatedRemark: Remark) => void;
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
    remark,
    currentUserId,
    currentUserRole,
    onClose,
    onUpdate,
}) => {
    const [replyText, setReplyText] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);

    // Функция для форматирования даты и времени
    const formatDateTime = (date: Date) => {
        const months = [
            "янв.",
            "фев.",
            "мар.",
            "апр.",
            "мая",
            "июня",
            "июля",
            "авг.",
            "сен.",
            "окт.",
            "ноя.",
            "дек.",
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${day} ${month} ${year} в ${hours}:${minutes}`;
    };

    // Функция для получения бейджа статуса
    const getStatusBadge = (status: RemarkStatus) => {
        switch (status) {
            case RemarkStatus.PENDING:
                return (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        Ожидает ответа
                    </span>
                );
            case RemarkStatus.RESPONDED:
                return (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Отвечено
                    </span>
                );
            case RemarkStatus.APPROVED:
                return (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        Одобрено
                    </span>
                );
            case RemarkStatus.REJECTED:
                return (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Требует исправления
                    </span>
                );
            default:
                return null;
        }
    };

    // Функция для форматирования размера файла
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " Б";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " КБ";
        return (bytes / (1024 * 1024)).toFixed(1) + " МБ";
    };

    // Обработчик отправки ответа
    const handleSendReply = () => {
        if (!replyText.trim() && attachments.length === 0) return;

        // TODO: Здесь должен быть реальный API запрос
        const newMessage: RemarkMessage = {
            id: `msg-${Date.now()}`,
            remark_id: remark.id,
            sender_id: currentUserId || 0,
            sender_name: "Текущий пользователь", // TODO: Получить из контекста
            sender_avatar: "",
            sender_role: currentUserRole || "student",
            message: replyText,
            attachments: [], // TODO: Обработка загруженных файлов
            created_at: new Date(),
        };

        const updatedRemark: Remark = {
            ...remark,
            messages: [...remark.messages, newMessage],
            status:
                currentUserRole === "student" ? RemarkStatus.RESPONDED : remark.status,
            updated_at: new Date(),
        };

        onUpdate(updatedRemark);
        setReplyText("");
        setAttachments([]);
    };

    // Обработчик выбора файлов
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    // Получение инициалов для аватара
    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name[0] || "?";
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden sm:rounded-lg">
                <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-start justify-between gap-3 mr-6">
                        <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
                            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2 text-left">
                                {remark.theme_title}
                            </DialogTitle>
                            <div className="flex flex-wrap items-center gap-2">
                                {getStatusBadge(remark.status)}
                                <span className="text-xs sm:text-sm text-gray-500">
                                    #{remark.id.split("-")[1]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Информация о курсе */}
                    <div className="mt-3 text-xs sm:text-sm text-gray-600 space-y-1 text-left">
                        <div className="font-medium truncate">{remark.course_name}</div>
                        <div className="flex flex-wrap gap-x-2">
                            <span>
                                Студент: <span className="font-medium">{remark.student_name}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>Группа: {remark.student_group}</span>
                        </div>
                    </div>
                </DialogHeader>

                {/* Messages Thread */}
                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="px-4 sm:px-6 py-4 space-y-4">
                        {/* Блок файла (если это замечание к файлу) */}
                        {remark.type === RemarkType.FILE && remark.original_file && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <File className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-xs sm:text-sm font-medium text-gray-900 truncate">
                                            {remark.original_file.file_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(remark.original_file.file_size)}
                                        </p>
                                    </div>
                                    <a
                                        href={remark.original_file.file_url}
                                        download
                                        className="text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                                    >
                                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Сообщения */}
                        {remark.messages.map((message) => {
                            const isTeacher = message.sender_role === "teacher";
                            const isCurrentUser = message.sender_id === currentUserId;

                            return (
                                <div key={message.id} className="flex gap-2 sm:gap-3">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {message.sender_avatar ? (
                                            <img
                                                src={message.sender_avatar}
                                                alt={message.sender_name}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                            />
                                        ) : (
                                            <div
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${isTeacher ? "bg-blue-600" : "bg-green-600"
                                                    }`}
                                            >
                                                {getInitials(message.sender_name)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Sender Info */}
                                        <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-1">
                                            <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                                {message.sender_name}
                                            </span>
                                            {isTeacher && (
                                                <span className="px-1.5 sm:px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded flex-shrink-0">
                                                    Преподаватель
                                                </span>
                                            )}
                                            <span className="text-xs sm:text-sm text-gray-500">
                                                {formatDateTime(message.created_at)}
                                            </span>
                                        </div>

                                        {/* Message Text */}
                                        <div
                                            className={`rounded-lg p-2 sm:p-3 ${isTeacher
                                                ? "bg-blue-50 border border-blue-100"
                                                : "bg-gray-50 border border-gray-200"
                                                }`}
                                        >
                                            <p className="text-gray-900 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                {message.message}
                                            </p>
                                        </div>

                                        {/* Attachments */}
                                        {message.attachments.length > 0 && (
                                            <div className="mt-2 space-y-2">
                                                {message.attachments.map((attachment) => (
                                                    <a
                                                        key={attachment.id}
                                                        href={attachment.file_url}
                                                        download
                                                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                                    >
                                                        <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm text-gray-700 flex-1 truncate">
                                                            {attachment.file_name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                                            {formatFileSize(attachment.file_size)}
                                                        </span>
                                                        <Download className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Footer - Reply Section */}
                {remark.status !== RemarkStatus.APPROVED && (
                    <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 sticky bottom-0">
                        <div className="space-y-2 sm:space-y-3">
                            {/* File attachments preview */}
                            {attachments.length > 0 && (
                                <div className="space-y-1">
                                    {attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200"
                                        >
                                            <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="flex-1 truncate">{file.name}</span>
                                            <button
                                                onClick={() =>
                                                    setAttachments(attachments.filter((_, i) => i !== index))
                                                }
                                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                                            >
                                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Text input */}
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Написать ответ..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                rows={3}
                            />

                            {/* Action buttons */}
                            <div className="flex items-center justify-between gap-2">
                                <label className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Прикрепить файл</span>
                                    <span className="sm:hidden">Файл</span>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>

                                <button
                                    onClick={handleSendReply}
                                    disabled={!replyText.trim() && attachments.length === 0}
                                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm"
                                >
                                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Отправить
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
