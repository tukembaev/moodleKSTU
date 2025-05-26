import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LucideWandSparkles } from "lucide-react";
import React, { useState } from "react";
import { GaugeWithSliderSmall } from "shared/components/Progress/GaugeWithSliderSmall";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

export function SetMark({
  text,
  id,
  max_points,
  points,
  children,
}: {
  text: string;
  id?: string;
  max_points: number;
  points?: number;
  children: React.ReactNode;
}) {
  const { mutate: rate_answer, isPending } = courseQueries.rate_answer();
  const [score, setScore] = useState(points as number);
  const handleSubmit = () => {
    debugger;
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
        <DropdownMenuSeparator />

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
