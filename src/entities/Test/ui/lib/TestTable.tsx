import {
  getTestStudentId,
  resolveTestPassed,
  studentNeedsReview,
  TestAttemptAnswer,
  TestQuestion,
  TestResult,
} from "entities/Test/model/types/test";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { TeacherGradeComment } from "entities/Course/lib/teacherComment";
import { useMemo, useState, Fragment } from "react";
import { LuCheckCheck, LuChevronDown, LuRotateCcw, LuUser, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UseConfirmationDialog } from "shared/components";
import {
  QUESTION_TYPE_LABELS,
  resolveQuestionType,
} from "shared/components/QuestionEditor";
import { Avatar, AvatarImage, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { FieldLabel } from "shared/components/FieldLabel";
import { Textarea } from "shared/shadcn/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import { cn } from "shared/lib/utils";

const optionText = (option: string | { id: string; text: string }) =>
  typeof option === "string" ? option : option.text;

const EssayGradeForm = ({
  resultId,
  questionId,
  comment,
}: {
  resultId: string;
  questionId: string;
  comment?: string | null;
}) => {
  const { mutate: rateAnswer, isPending } = courseQueries.rate_answer();
  const [teacherComment, setTeacherComment] = useState(comment ?? "");

  const grade = (points: number) => {
    rateAnswer({
      result: resultId,
      questionId,
      points,
      comment: teacherComment.trim() || null,
    });
  };

  return (
    <div className="mt-3 space-y-2 rounded-lg border bg-background p-3">
      <FieldLabel className="text-xs text-muted-foreground">
        Комментарий к ответу
      </FieldLabel>
      <Textarea
        value={teacherComment}
        onChange={(event) => setTeacherComment(event.target.value)}
        placeholder="Необязательный комментарий"
        rows={3}
        className="min-h-16 resize-none"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => grade(1)}
        >
          Зачесть
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => grade(0)}
        >
          Не зачесть
        </Button>
      </div>
    </div>
  );
};

const AnswerReview = ({
  answer,
  question,
  resultId,
}: {
  answer: TestAttemptAnswer;
  question?: TestQuestion;
  resultId?: string | null;
}) => {
  const type = resolveQuestionType({
    questionType: answer.questionType || question?.questionType,
    multipleAnswers: question?.multipleAnswers,
  });
  const title = answer.questionText || question?.question || "Вопрос";
  const selected = (answer.selectedOptions || []).map(optionText).filter(Boolean);
  const textAnswer = answer.textAnswer?.trim() || "";
  const pending = answer.needsReview === true;

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-normal">
          {QUESTION_TYPE_LABELS[type]}
        </Badge>
        {pending ? (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Требует проверки
          </Badge>
        ) : answer.isSkipped ? (
          <Badge variant="outline">Пропущен</Badge>
        ) : answer.isCorrect ? (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
            Правильно
          </Badge>
        ) : answer.isCorrect === false ? (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            Неправильно
          </Badge>
        ) : null}
      </div>
      <p className="text-sm font-medium">{title}</p>
      {type === "essay" || type === "short_answer" ? (
        <p className="mt-2 whitespace-pre-wrap break-words rounded-md bg-muted/50 px-3 py-2 text-sm">
          {textAnswer || "Ответ не дан"}
        </p>
      ) : selected.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {selected.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Ответ не выбран</p>
      )}
      <TeacherGradeComment comment={answer.comment} className="mt-2" />
      {pending && resultId && (
        <EssayGradeForm
          resultId={resultId}
          questionId={answer.questionId}
          comment={answer.comment}
        />
      )}
    </div>
  );
};

const TestTable = ({
  data,
  testId,
  courseId,
  questions = [],
  minPoints = 0,
}: {
  data: TestResult[];
  testId: string | null;
  courseId: string | null;
  questions?: TestQuestion[];
  minPoints?: number;
}) => {
  const navigate = useNavigate();
  const { mutate: resetResult, isPending } = testQueries.reset_result();
  const [onlyPending, setOnlyPending] = useState(false);
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const questionById = useMemo(
    () => new Map(questions.map((question) => [question.id, question])),
    [questions]
  );

  const rows = useMemo(
    () => (onlyPending ? data.filter(studentNeedsReview) : data),
    [data, onlyPending]
  );

  const toggleRow = (key: string) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant={onlyPending ? "default" : "outline"}
          onClick={() => setOnlyPending((value) => !value)}
        >
          Требует проверки
        </Button>
        {onlyPending && (
          <p className="text-sm text-muted-foreground">
            Показаны студенты с непроверенными развёрнутыми ответами
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border px-4 py-8 text-center text-sm text-muted-foreground">
          Нет работ, требующих проверки
        </div>
      ) : (
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
              {rows.map((student, index) => {
                const hasResult = student.result !== null && student.result !== undefined;
                const resultValue = student.result || 0;
                const pending = studentNeedsReview(student);
                const passed = resolveTestPassed({
                  result: student.result,
                  minPoints,
                  passed: student.passed,
                  needsReview: pending,
                });
                const studentId = getTestStudentId(student);
                const answers = student.answers || [];
                const rowKey = `${student.result_id || studentId}-${index}`;
                const answersOpen = openRows.has(rowKey);

                return (
                  <Fragment key={rowKey}>
                    <TableRow className="hover:bg-muted/50 transition-colors">
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
                                pending
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                  : passed === true
                                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                    : passed === false
                                      ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                                      : "text-muted-foreground"
                              )}
                            >
                              {pending ? (
                                <span>На проверке</span>
                              ) : passed === true ? (
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
                            <div className="flex flex-col items-center justify-center gap-1">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-semibold text-lg">{resultValue}</span>
                                <span className="text-sm text-muted-foreground">баллов</span>
                              </div>
                              <TeacherGradeComment comment={student.comment} compact />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {answers.length > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => toggleRow(rowKey)}
                              >
                                Ответы
                                <LuChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform",
                                    answersOpen && "rotate-180"
                                  )}
                                />
                              </Button>
                            )}
                            {hasResult && passed !== true && testId && courseId && studentId > 0 && (
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
                          </div>
                        </TableCell>
                      </TableRow>
                      {answersOpen && answers.length > 0 && (
                        <TableRow key={`${rowKey}-answers`} className="hover:bg-transparent">
                          <TableCell colSpan={5} className="p-0">
                            <div className="space-y-3 bg-muted/30 px-4 py-4">
                              {answers.map((answer) => (
                                <AnswerReview
                                  key={answer.questionId}
                                  answer={answer}
                                  question={questionById.get(answer.questionId)}
                                  resultId={student.result_id}
                                />
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TestTable;
