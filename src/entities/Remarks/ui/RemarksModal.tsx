import React, { useState, useMemo } from "react";
import { X, Send, Check, MessageSquare } from "lucide-react";
import { Remark, RemarkStatus, RemarkMessage } from "../model/types/remarks";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "shared/shadcn/ui/dialog";
import { useAddRemarkMessage, useUpdateRemarkStatus, remarkQueries } from "../model/services/remarkQueryFactory";
import { useAuth } from "shared/hooks";
import { useQuery } from "@tanstack/react-query";

interface RemarksModalProps {
    remark: Remark;
    onClose: () => void;
    onUpdate: () => void;
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
    remark,
    onClose,
    onUpdate,
}) => {
    const [replyText, setReplyText] = useState("");
    const [footerMode, setFooterMode] = useState<'actions' | 'message'>('actions');
    const { mutate: addRemarkMessage } = useAddRemarkMessage();
    const { mutate: updateRemarkStatus } = useUpdateRemarkStatus();

    // Fetch fresh remark data to get updated messages
    const { data: freshRemark, refetch: refetchRemark } = useQuery({
        ...remarkQueries.remarkById(remark.id),
        initialData: remark,
    });

    // Use fresh data if available, otherwise fallback to prop
    const currentRemark = freshRemark || remark;

    // Group consecutive messages by same sender
    const groupedMessages = useMemo(() => {
        const groups: { senderId: number; senderName: string; senderRole: string; senderAvatar?: string; messages: RemarkMessage[] }[] = [];
        
        currentRemark.messages.forEach((message) => {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.senderId === message.sender_id) {
                lastGroup.messages.push(message);
            } else {
                groups.push({
                    senderId: message.sender_id,
                    senderName: message.sender_name,
                    senderRole: message.sender_role,
                    senderAvatar: message.sender_avatar,
                    messages: [message],
                });
            }
        });
        
        return groups;
    }, [currentRemark.messages]);

    const { isStudent } = useAuth()
    // Функция для форматирования даты и времени
    // Функция для форматирования даты и времени
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
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


    // Обработчик отправки ответа
    const handleSendReply = () => {
        if (!replyText.trim()) return;

        addRemarkMessage(
            {
                id: remark.id,
                data: {
                    message: replyText
                }
            },
            {
                onSuccess: () => {
                    refetchRemark();
                    onUpdate();
                }
            }
        );

        setReplyText("");
    };

    const handleStatusUpdate = (newStatus: RemarkStatus) => {
        updateRemarkStatus(
            {
                id: remark.id,
                data: { status: newStatus }
            },
            {
                onSuccess: () => {
                    refetchRemark();
                    onUpdate();
                }
            }
        );
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
                                {currentRemark.title}
                            </DialogTitle>
                            <div className="flex flex-wrap items-center gap-2">
                                {getStatusBadge(currentRemark.status)}
                                <span className="text-xs sm:text-sm text-gray-500">
                                    #{currentRemark.id.split("-")[1]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Информация о курсе */}
                    <div className="mt-3 text-xs sm:text-sm text-gray-600 space-y-1 text-left">
                        <div className="font-medium truncate">{currentRemark.course_name}</div>
                        <div className="flex flex-col gap-y-1">
                            <span>
                                Задание: <span className="font-medium">{currentRemark.theme_title}</span>
                            </span>
                            <span>
                                Студент: <span className="font-medium">{currentRemark.student_name}</span>
                            </span>
                      
                        </div>
                    </div>
                </DialogHeader>

                {/* Messages Thread */}
                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="px-4 sm:px-6 py-4 space-y-4">

                        {/* Сообщения сгруппированные по отправителю */}
                        {groupedMessages.map((group, groupIndex) => {
                            const isTeacher = group.senderRole === "teacher";

                            return (
                                <div key={`group-${groupIndex}-${group.senderId}`} className="flex gap-2 sm:gap-3">
                                    {/* Avatar - показываем только один раз для группы */}
                                    <div className="flex-shrink-0">
                                        {group.senderAvatar ? (
                                            <img
                                                src={group.senderAvatar}
                                                alt={group.senderName}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                            />
                                        ) : (
                                            <div
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${isTeacher ? "bg-blue-600" : "bg-green-600"
                                                    }`}
                                            >
                                                {getInitials(group.senderName)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        {/* Sender Info - показываем только один раз для группы */}
                                        <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                                            <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                                {group.senderName}
                                            </span>
                                            {isTeacher && (
                                                <span className="px-1.5 sm:px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded flex-shrink-0">
                                                    Преподаватель
                                                </span>
                                            )}
                                        </div>

                                        {/* Все сообщения от этого отправителя подряд */}
                                        {group.messages.map((message) => (
                                            <div key={message.id}>
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
                                                <span className="text-xs text-gray-500 mt-1 block">
                                                    {formatDateTime(message.created_at)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Footer - Actions and Reply Section */}
                {currentRemark.status !== RemarkStatus.APPROVED && (
                    <div className="border-t border-gray-200 px-4 sm:px-6 py-3 bg-gray-50 sticky bottom-0">
                        <div className="space-y-3">
                            {/* Apple-style Toggle */}
                            <div className="flex items-center justify-center">
                                <div className="inline-flex items-center bg-gray-200 rounded-full p-0.5">
                                    <button
                                        onClick={() => setFooterMode('actions')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            footerMode === 'actions'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {!isStudent ? 'Действия' : 'Просмотр'}
                                    </button>
                                    <button
                                        onClick={() => setFooterMode('message')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                                            footerMode === 'message'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <MessageSquare className="w-3 h-3" />
                                        Сообщение
                                    </button>
                                </div>
                            </div>

                            {/* Content based on mode */}
                            {footerMode === 'actions' ? (
                                // Action Buttons Mode
                                !isStudent && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {currentRemark.status === RemarkStatus.RESPONDED && (
                                            <button
                                                onClick={() => handleStatusUpdate(RemarkStatus.REJECTED)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                                            >
                                                <X className="w-4 h-4" />
                                                Отклонить
                                            </button>
                                        )}
                                        {(currentRemark.status === RemarkStatus.PENDING ||
                                            currentRemark.status === RemarkStatus.REJECTED ||
                                            currentRemark.status === RemarkStatus.RESPONDED) && (
                                                <button
                                                    onClick={() => handleStatusUpdate(RemarkStatus.APPROVED)}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Одобрить
                                                </button>
                                            )}
                                    </div>
                                )
                            ) : (
                                // Message Input Mode
                                <div className="space-y-2">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Написать ответ..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                        rows={3}
                                        autoFocus
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                handleSendReply();
                                                setReplyText("");
                                            }}
                                            disabled={!replyText.trim()}
                                            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-sm"
                                        >
                                            <Send className="w-4 h-4" />
                                            Отправить
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
