import React, { useState } from "react";
import { MessageCircle, FileText, File } from "lucide-react";
import { Remark, RemarkStatus, RemarkType } from "../model/types/remarks";
import { RemarksModal } from "./RemarksModal";

interface RemarksListProps {
    remarks: Remark[];
    activeTab?: "open" | "archive";
    onTabChange?: (tab: "open" | "archive") => void;
    showTabs?: boolean;
    currentUserId?: number;
    currentUserRole?: "teacher" | "student";
    filters?: React.ReactNode; // Слот для фильтров
    openCount?: number;
    archiveCount?: number;
}

export const RemarksList: React.FC<RemarksListProps> = ({
    remarks,
    activeTab = "open",
    onTabChange,
    showTabs = true,
    currentUserId,
    currentUserRole,
    filters,
    openCount: propOpenCount,
    archiveCount: propArchiveCount,
}) => {
    const [selectedRemark, setSelectedRemark] = useState<Remark | null>(null);

    // Подсчет количества открытых и архивных замечаний
    // Если пропсы переданы, используем их. Иначе считаем из переданного списка (что может быть неверно если список уже отфильтрован по табу)
    const openCount = propOpenCount ?? remarks.filter((r) => r.status !== RemarkStatus.APPROVED).length;
    const archiveCount = propArchiveCount ?? remarks.filter((r) => r.status === RemarkStatus.APPROVED).length;

    // Функция для получения иконки статуса
    const getStatusIcon = (status: RemarkStatus) => {
        switch (status) {
            case RemarkStatus.PENDING:
                return <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />;
            case RemarkStatus.RESPONDED:
                return <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />;
            case RemarkStatus.APPROVED:
                return (
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                );
            case RemarkStatus.REJECTED:
                return <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0" />;
            default:
                return <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />;
        }
    };

    // Функция для форматирования даты на русском
    const formatDate = (date: Date) => {
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
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Функция для получения бейджа типа
    const getTypeBadge = (type: RemarkType) => {
        if (type === RemarkType.FILE) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    <File className="w-3 h-3" />
                    <span className="hidden sm:inline">Файл</span>
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <FileText className="w-3 h-3" />
                    <span className="hidden sm:inline">Текст</span>
                </span>
            );
        }
    };

    return (
        <div className="w-full">
            {/* Фильтры (передаются извне через слот) */}
            {filters && <div className="mb-4">{filters}</div>}

            {/* Табы */}
            {showTabs && (
                <div className="flex gap-2 mb-4 border-b border-gray-200 overflow-x-auto">
                    <button
                        onClick={() => onTabChange?.("open")}
                        className={`px-3 sm:px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === "open"
                            ? "text-gray-900 border-b-2 border-blue-500"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Открытые
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === "open"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {openCount}
                        </span>
                    </button>
                    <button
                        onClick={() => onTabChange?.("archive")}
                        className={`px-3 sm:px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === "archive"
                            ? "text-gray-900 border-b-2 border-blue-500"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Архив
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === "archive"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {archiveCount}
                        </span>
                    </button>
                </div>
            )}

            {/* Список замечаний */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {remarks.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center text-gray-500">
                        <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-base sm:text-lg font-medium">Замечания не найдены</p>
                        <p className="text-xs sm:text-sm mt-1">Попробуйте изменить фильтры</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {remarks.map((remark) => (
                            <div
                                key={remark.id}
                                onClick={() => setSelectedRemark(remark)}
                                className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start gap-2 sm:gap-3">
                                    {/* Иконка статуса */}
                                    <div className="mt-1">{getStatusIcon(remark.status)}</div>

                                    {/* Основной контент */}
                                    <div className="flex-1 min-w-0">
                                        {/* Заголовок */}
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                                            {remark.theme_title}
                                        </h3>

                                        {/* Метаданные */}
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                            <span className="hidden sm:inline">
                                                #{remark.id.split("-")[1]} открыто {formatDate(remark.created_at)}{" "}
                                            </span>
                                            <span className="sm:hidden">
                                                #{remark.id.split("-")[1]} • {formatDate(remark.created_at)}
                                            </span>
                                            <br className="sm:hidden" />
                                            студентом <span className="font-medium">{remark.student_name}</span>
                                            {" • "}
                                            <span className="hidden md:inline">
                                                в курсе <span className="font-medium">{remark.course_name}</span>
                                            </span>
                                            <span className="md:hidden font-medium truncate block sm:inline">
                                                {remark.course_name}
                                            </span>
                                        </p>

                                        {/* Бейдж типа */}
                                        <div className="mt-2">{getTypeBadge(remark.type)}</div>
                                    </div>

                                    {/* Счетчик сообщений */}
                                    <div className="flex items-center gap-1 text-gray-600 flex-shrink-0">
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">{remark.messages.length}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Модальное окно */}
            {selectedRemark && (
                <RemarksModal
                    remark={selectedRemark}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                    onClose={() => setSelectedRemark(null)}
                    onUpdate={(updatedRemark) => {
                        setSelectedRemark(updatedRemark);
                        // TODO: Обновить список замечаний
                    }}
                />
            )}
        </div>
    );
};
