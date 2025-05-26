import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";

import { LuCheckCheck, LuSparkles } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { getPointColor, Tracker, UseTooltip } from "shared/components";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";

const CourseResultTable = () => {
  const { id } = useParams();
  const openForm = useForm();
  const { data, isLoading } = useQuery(
    courseQueries.allStudentPerfomance(id as string)
  );

  if (isLoading) {
    return (
      <div className="rounded-md border w-fit mt-4">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Имя студента</TableHead>
              <TableHead className="w-[100px]">Группа</TableHead>
              <TableHead className="w-[100px]">Баллы</TableHead>
              <TableHead className="w-[150px]">Лабораторные</TableHead>
              <TableHead className="w-[150px]">Практики</TableHead>
              <TableHead className="w-[150px]">СРС</TableHead>
              <TableHead className="w-[150px]">Тесты</TableHead>
              <TableHead className="w-[150px]">Прочее</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border w-fit mt-4">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="w-[300px]">Имя студента</TableHead>
            <TableHead className="w-[100px]">Группа</TableHead>
            <TableHead className="w-[100px]">Баллы</TableHead>
            <TableHead className="w-[150px]">Лабораторные</TableHead>
            <TableHead className="w-[150px]">Практики</TableHead>
            <TableHead className="w-[150px]">СРС</TableHead>
            <TableHead className="w-[150px]">Тесты</TableHead>
            <TableHead className="w-[150px]">Прочее</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((student) => {
            const actual = [
              ...student.themes.lb,
              ...student.themes.pr,
              ...student.themes.srs,
              ...student.themes.tests.map((t) => ({ stud_points: t.result })), // у tests поле другое
              ...student.themes.other,
            ].reduce((sum, item) => sum + (item.stud_points || 0), 0);
            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                  </Avatar>
                  <p>{`${student.first_name} ${student.last_name}`}</p>
                  {student.is_end && (
                    <Badge
                      variant="outline"
                      className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 cursor-pointer "
                    >
                      <LuCheckCheck className="text-green-500 dark:text-green-400" />
                      Сдано
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{student.group}</TableCell>
                <TableCell>
                  {/* Подсчитываем общие баллы */}
                  {actual} / {student.max_points_course}
                </TableCell>
                <TableCell>
                  <Tracker
                    data={student.themes.lb.map((item) => ({
                      title: item.title,
                      points: item.stud_points || 0,
                      id: item.id_answer_task ?? undefined,
                      max_points: item.max_points,

                      color: getPointColor(
                        item.stud_points as number,
                        item.max_points
                      ),
                    }))}
                    hoverEffect={true}
                  />
                </TableCell>
                <TableCell>
                  <Tracker
                    data={student.themes.pr.map((item) => ({
                      title: item.title,
                      points: item.stud_points || 0,
                      id: item.id_answer_task ?? undefined,
                      max_points: item.max_points,
                      color: getPointColor(
                        item.stud_points as number,
                        item.max_points
                      ),
                    }))}
                    hoverEffect={true}
                  />
                </TableCell>
                <TableCell>
                  <Tracker
                    data={student.themes.srs.map((item) => ({
                      title: item.title,
                      id: item.id_answer_task ?? undefined,
                      points: item.stud_points || 0,
                      max_points: item.max_points,

                      color: getPointColor(
                        item.stud_points as number,
                        item.max_points
                      ),
                    }))}
                    hoverEffect={true}
                  />
                </TableCell>
                <TableCell>
                  <Tracker
                    data={student.themes.tests.map((item) => ({
                      title: item.title,
                      isTest: item.result,
                      points: item.result || 0,

                      color: getPointColor(
                        item.result as number,
                        item.max_points
                      ),
                    }))}
                    hoverEffect={true}
                  />
                </TableCell>
                <TableCell>
                  <Tracker
                    data={student.themes.other.map((item) => ({
                      title: item.title,
                      id: item.id_answer_task ?? undefined,
                      max_points: item.max_points,

                      points: item.stud_points || 0,
                      color: getPointColor(
                        item.stud_points as number,
                        item.max_points
                      ),
                    }))}
                    hoverEffect={true}
                  />
                </TableCell>
                <TableCell>
                  <UseTooltip text="Поставить итоговую оценку">
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        openForm(FormQuery.END_COURSE, {
                          user_id: String(student.user_id),
                          points: String(actual),
                        })
                      }
                    >
                      <LuSparkles />
                    </Button>
                  </UseTooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseResultTable;
