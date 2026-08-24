import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCircleHelp, LuPlus } from "react-icons/lu";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { Button } from "shared/shadcn/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const ThemeFAQ = ({ theme_id }: { theme_id: string }) => {
  const { isStudent } = useAuth();
  const openForm = useForm();

  const { data, isLoading } = useQuery(courseQueries.allThemeFAQ(theme_id));
  const faqs = data ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card px-4 py-4"
          >
            <Skeleton className="h-5 w-3/4 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Частые вопросы</p>
          <p className="text-sm text-muted-foreground">
            Ответы преподавателя по этой теме
          </p>
        </div>
        {!isStudent && (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              openForm(FormQuery.ADD_THEME_FAQ, {
                id: theme_id,
              })
            }
          >
            <LuPlus />
            Добавить FAQ
          </Button>
        )}
      </div>

      {faqs.length === 0 ? (
        <Empty className="min-h-48">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <LuCircleHelp />
            </EmptyMedia>
            <EmptyTitle>Пока нет вопросов</EmptyTitle>
            <EmptyDescription>
              {isStudent
                ? "Преподаватель ещё не добавил FAQ к этой теме"
                : "Добавьте первый вопрос, чтобы студентам было проще разобраться"}
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <Accordion
          type="single"
          collapsible
          defaultValue={faqs[0]?.id ?? "question-0"}
          className="flex flex-col gap-2"
        >
          {faqs.map(({ id, question, answer }, index) => {
            const value = id ?? `question-${index}`;

            return (
              <AccordionItem
                key={value}
                value={value}
                className="overflow-hidden rounded-xl border border-border/80 bg-card px-4 last:border-b data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="py-3.5 text-left text-[15px] font-medium leading-snug hover:no-underline">
                  <span className="flex min-w-0 items-start gap-3 pr-2">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="min-w-0">{question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-9 text-[15px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default ThemeFAQ;
