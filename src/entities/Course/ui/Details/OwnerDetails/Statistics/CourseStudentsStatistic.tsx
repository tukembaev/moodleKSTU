import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
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
  { date: "2024-03-15", lb: 450, pr: 300, srs: 200, other: 100 },
  { date: "2024-04-16", lb: 450, pr: 300, srs: 200, other: 900 },
  { date: "2024-05-17", lb: 450, pr: 300, srs: 200, other: 100 },
  { date: "2024-06-18", lb: 450, pr: 300, srs: 200, other: 100 },
  { date: "2024-07-19", lb: 450, pr: 300, srs: 200, other: 100 },
  { date: "2024-08-20", lb: 450, pr: 300, srs: 200, other: 100 },
];

const chartConfig = {
  activities: {
    label: "Активность",
  },
  lb: {
    label: "Лабораторные",
    color: "#8884d8",
  },
  pr: {
    label: "Практики",
    color: "#82ca9d",
  },
  srs: {
    label: "СРС",
    color: "#ffc658",
  },
  other: {
    label: "Прочее",
    color: "#ff7f50",
  },
} satisfies ChartConfig;

export function CourseStudentsStatistic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика сдачи работ</CardTitle>
        <CardDescription>Январь - Июнь 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("ru-RU", {
                  month: "short",
                });
              }}
            />
            <Bar
              dataKey="lb"
              stackId="a"
              fill="#8884d8"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="pr"
              stackId="a"
              fill="#82ca9d"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="srs"
              stackId="a"
              fill="#ffc658"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="other"
              stackId="a"
              fill="#ff7f50"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="activities"
                  indicator="line"
                  className="w-[180px]"
                />
              }
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          На 5.2% больше сданных работ в этом месяце
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Сводка по сдаче работ за последние 6 месяцев
        </div>
      </CardFooter>
    </Card>
  );
}
