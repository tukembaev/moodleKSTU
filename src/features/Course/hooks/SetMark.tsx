import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { AlertCircleIcon, LucideWandSparkles } from "lucide-react";
import React, { useState } from "react";
import { GaugeWithSliderSmall } from "shared/components/Progress/GaugeWithSliderSmall";
import { Alert, AlertTitle } from "shared/shadcn/ui/alert";
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

        <Alert variant="warning">
          <AlertCircleIcon />
          <AlertTitle>Студент имеет 3 замечания</AlertTitle>
        </Alert>
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
