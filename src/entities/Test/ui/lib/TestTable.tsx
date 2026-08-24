import { getTestStudentId, TestResult } from "entities/Test/model/types/test";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { LuCheckCheck, LuRotateCcw, LuUser, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UseConfirmationDialog } from "shared/components";
import { Avatar, AvatarImage, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import { cn } from "shared/lib/utils";

const TestTable = ({
  data,
  testId,
  courseId,
}: {
  data: TestResult[];
  testId: string | null;
  courseId: string | null;
}) => {
  const navigate = useNavigate();
  const { mutate: resetResult, isPending } = testQueries.reset_result();

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <LuUser className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Нет результатов</p>
        <p className="text-sm text-muted-foreground mt-1">
          Студенты еще не проходили этот тест
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px]">№</TableHead>
            <TableHead className="min-w-[250px]">Студент</TableHead>
            <TableHead className="w-[150px] text-center">Статус</TableHead>
            <TableHead className="w-[180px] text-center">Баллы</TableHead>
            <TableHead className="w-[180px] text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((student, index) => {
            const hasResult = student.result !== null && student.result !== undefined;
            const resultValue = student.result || 0;
            const passed = student.passed;
            const studentId = getTestStudentId(student);

            return (
              <TableRow
                key={`${studentId}-${index}`}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-muted-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => navigate(`/profile/${student.user_id || studentId}`)}
                      className="font-medium text-left hover:text-primary transition-colors cursor-pointer hover:underline"
                    >
                      {student.name}
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Badge
                      variant={passed === true ? "default" : "outline"}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1",
                        passed === true
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                          : passed === false
                            ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            : "text-muted-foreground"
                      )}
                    >
                      {passed === true ? (
                        <>
                          <LuCheckCheck className="h-4 w-4" />
                          <span>Пройден</span>
                        </>
                      ) : passed === false ? (
                        <>
                          <LuX className="h-4 w-4" />
                          <span>Не пройден</span>
                        </>
                      ) : (
                        <>
                          <LuX className="h-4 w-4" />
                          <span>Не сдано</span>
                        </>
                      )}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {hasResult ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-lg">{resultValue}</span>
                      <span className="text-sm text-muted-foreground">баллов</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {passed === false && testId && courseId && (
                    <UseConfirmationDialog
                      title="Разрешить пересдачу?"
                      description="Результат студента будет обнулён. Он сможет пройти тест заново."
                      onConfirm={() =>
                        resetResult({
                          test_id: testId,
                          student_id: studentId,
                          course_id: courseId,
                        })
                      }
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          className="gap-1.5"
                        >
                          <LuRotateCcw className="h-4 w-4" />
                          Разрешить пересдачу
                        </Button>
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestTable;
