import { useQuery } from "@tanstack/react-query";
import { RemarksList, remarkQueries } from "entities/Remarks";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "shared/shadcn/ui/dialog";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";


export function ThemeRemarks({
    student_id,
    theme_id,
    children,
}: {
    student_id: number;
    theme_id: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    console.log(student_id, theme_id)
    const { data: remarks = [], isLoading } = useQuery({
        ...remarkQueries.remarksByThemeAndStudent(theme_id, student_id),
        enabled: open && !!theme_id && !!student_id,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
                    <DialogTitle className="text-base font-semibold">Все замечания студента</DialogTitle>
                </DialogHeader>

                <ScrollArea className="border-none">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="text-gray-500">Загрузка замечаний...</span>
                        </div>
                    ) : (
                        <RemarksList remarks={remarks} student_id={student_id} theme_id={theme_id} showTabs={false} withBorder={false} />
                    )}
                </ScrollArea>

            </DialogContent>
        </Dialog>
    );
}
