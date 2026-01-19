import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { ClockIcon, LucideWandSparkles, MessageSquareIcon } from "lucide-react";
import React, { useState } from "react";
import { GaugeWithSliderSmall } from "shared/components/Progress/GaugeWithSliderSmall";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

export function SetMark({
  text,
  id,
  max_points,
  points,
  remarks,
  pending_remarks,
  children,
}: {
  text: string;
  id?: string;
  max_points: number;
  points?: number;
  remarks?: number;
  pending_remarks?: number;
  children: React.ReactNode;
}) {
  const { mutate: rate_answer, isPending } = courseQueries.rate_answer();
  const [score, setScore] = useState(points as number);
  const handleSubmit = () => {
    rate_answer({
      answer: id as string,
      points: score,
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <DropdownMenuLabel className="mb-2 text-center">
          {text}
        </DropdownMenuLabel>
        <div className="flex gap-2 mb-4 justify-center">
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors cursor-pointer border border-blue-500/20">
              <MessageSquareIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {remarks || 0}
              </span>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Замечаний
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-full transition-colors cursor-pointer border border-amber-500/20">
              <ClockIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                {pending_remarks || 0}
              </span>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Ожидает ответа
              </div>
            </div>
          </div>
        </div>
        <GaugeWithSliderSmall
          score={score}
          maxScore={Number(max_points)}
          onChange={setScore}
        />

        <Button
          className="w-full mt-5 flex gap-2"
          variant={"outline"}
          disabled={isPending}
          onClick={() => handleSubmit()}
        >
          Применить
          <LucideWandSparkles />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
