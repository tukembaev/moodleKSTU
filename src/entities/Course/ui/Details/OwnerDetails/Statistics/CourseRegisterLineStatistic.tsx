"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { month: "January", registered: 186 },
  { month: "February", registered: 305 },
  { month: "March", registered: 237 },
  { month: "April", registered: 73 },
  { month: "May", registered: 209 },
  { month: "June", registered: 214 },
];

const chartConfig = {
  registered: {
    label: "Зарегистрировано",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CourseRegisterLineStatistic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика регистраций</CardTitle>
        <CardDescription>Январь - Июнь 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="registered"
              type="natural"
              stroke="hsl(217.2 91.2% 59.8%)"
              strokeWidth={2}
              dot={{
                fill: "hsl(221.2 83.2% 53.3%)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          На 5.2% больше регистраций в этом месяце{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Сводка по регистрациям за последние 6 месяцев
        </div>
      </CardFooter>
    </Card>
  );
}
