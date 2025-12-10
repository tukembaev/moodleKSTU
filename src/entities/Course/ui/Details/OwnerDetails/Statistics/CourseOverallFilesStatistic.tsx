"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "shared/shadcn/ui/chart";

const chartData = [
  { date: "2024-06-01", file: 178 },
  { date: "2024-06-02", file: 470 },
  { date: "2024-06-03", file: 103 },
  { date: "2024-06-04", file: 439 },
  { date: "2024-06-05", file: 88 },
  { date: "2024-06-06", file: 294 },
  { date: "2024-06-07", file: 323 },
  { date: "2024-06-08", file: 385 },
  { date: "2024-06-09", file: 438 },
  { date: "2024-06-10", file: 155 },
  { date: "2024-06-11", file: 92 },
  { date: "2024-06-12", file: 492 },
  { date: "2024-06-13", file: 81 },
  { date: "2024-06-14", file: 426 },
  { date: "2024-06-15", file: 307 },
  { date: "2024-06-16", file: 371 },
  { date: "2024-06-17", file: 475 },
  { date: "2024-06-18", file: 107 },
  { date: "2024-06-19", file: 341 },
  { date: "2024-06-20", file: 408 },
  { date: "2024-06-21", file: 169 },
  { date: "2024-06-22", file: 317 },
  { date: "2024-06-23", file: 480 },
  { date: "2024-06-24", file: 132 },
  { date: "2024-06-25", file: 141 },
  { date: "2024-06-26", file: 434 },
  { date: "2024-06-27", file: 448 },
  { date: "2024-06-28", file: 149 },
  { date: "2024-06-29", file: 103 },
  { date: "2024-06-30", file: 446 },
];

const chartConfig = {
  file: {
    label: "Файлы",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CourseOverallFilesStatistic() {
  const total = React.useMemo(
    () => ({
      file: chartData.reduce((acc, curr) => acc + curr.file, 0),
    }),
    []
  );

  return (
    <Card className=" pt-0 mt-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6">
          <CardTitle>Загруженные файлы</CardTitle>
          <CardDescription>
            Общее количество файлов за последние 30 дней
          </CardDescription>
        </div>
        <div className="flex">
          <button
            data-active
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6 bg-muted/50"
          >
            <span className="text-xs text-muted-foreground">Файлы</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.file.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full pb-2"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="file"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey="file" fill="var(--color-file)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
