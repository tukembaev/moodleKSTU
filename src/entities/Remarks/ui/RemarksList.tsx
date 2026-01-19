import { AlertCircle, CheckCircle2, Clock, FileText, HelpCircle, MessageCircle, MessageSquare, Plus } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared/shadcn/ui/dialog";
import { Remark, RemarkStatus } from "../model/types/remarks";
import { AddRemarkForm } from "./AddRemarkForm";
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
    withBorder?: boolean;
    theme_id?: string;
    student_id?: number;
    isStudent?: boolean;
}

export const RemarksList: React.FC<RemarksListProps> = ({
    remarks,
    activeTab = "open",
    onTabChange,
    showTabs = true,
    
    filters,
    theme_id,
    student_id,
    openCount: propOpenCount,
    archiveCount: propArchiveCount,
    withBorder = true,
    isStudent,
}) => {
    const [selectedRemark, setSelectedRemark] = useState<Remark | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Подсчет количества открытых и архивных замечаний
    // Если пропсы переданы, используем их. Иначе считаем из переданного списка (что может быть неверно если список уже отфильтрован по табу)
    const openCount = propOpenCount ?? remarks.filter((r) => r.status !== RemarkStatus.APPROVED).length;
    const archiveCount = propArchiveCount ?? remarks.filter((r) => r.status === RemarkStatus.APPROVED).length;

    // Функция для получения иконки статуса
    const getStatusIcon = (status: RemarkStatus) => {
        switch (status) {
            case RemarkStatus.PENDING:
                return <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />;
            case RemarkStatus.RESPONDED:
                return <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0" />;
            case RemarkStatus.APPROVED:
                return <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />;
            case RemarkStatus.REJECTED:
                return <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
            default:
                return <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />;
        }
    };


    const formatDate = (dateString: string) => {
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
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
            <div className={`bg-white ${withBorder ? "border border-gray-200" : ""} rounded-lg overflow-hidden`}>
                {remarks.length === 0 ? (
                    <div>

                        <div className="p-6 sm:p-8 text-center text-gray-500">
                            <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-base sm:text-lg font-medium">Замечания не найдены</p>
                        </div>
                        {!isStudent && (
                            <button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors w-full text-left flex items-center gap-3 text-gray-500 border-t border-gray-100 group"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
                                    <Plus className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm sm:text-base font-medium text-gray-600">Добавить новое замечание...</span>
                                </div>
                            </button>
                        )}
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
                                            {remark.title}
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

                                    </div>

                                    {/* Счетчик сообщений */}
                                    <div className="flex items-center gap-1 text-gray-600 flex-shrink-0">
                                        <MessageCircle className="w-4 h-4" />
                                        {/* <span className="text-sm font-medium">{remark.messages.length}</span> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Кнопка добавления нового замечания */}
                        {!isStudent && (
                            <button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors w-full text-left flex items-center gap-3 text-gray-500 border-t border-gray-100 group"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
                                    <Plus className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm sm:text-base font-medium text-gray-600">Добавить новое замечание...</span>
                                </div>
                            </button>
                        )}

                    </div>
                )}

            </div>

            {/* Модальное окно создания замечания */}

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Новое замечание</DialogTitle>
                    </DialogHeader>
                    <AddRemarkForm
                        theme_id={theme_id || ''}
                        student_id={student_id || 0}
                        onSubmit={(data) => {
                            console.log("New remark data:", data);
                            setIsAddDialogOpen(false);
                        }}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Модальное окно */}
            {selectedRemark && (
                <RemarksModal
                    remark={selectedRemark}
                    onClose={() => setSelectedRemark(null)}
                    onUpdate={() => {
                    }}
                />
            )}
        </div>
    );
};
