import { useQuery } from "@tanstack/react-query";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { LuChevronDown } from "react-icons/lu";
import { courseQueries } from "../../model/services/courseQueryFactory";
import ListOfStudentsWithAnswers from "./ListOfStudentsWithAnswers";
import SingleStudentAnswers from "./SingleStudentAnswers";

const ThemeAnswers = ({
  id,
  collapsible = false,
  open = true,
  onOpenChange,
}: {
  id: string | null;
  collapsible?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { isStudent } = useAuth();
  const {
    data: answersOfAllStudents,
    isLoading: isStudentsLoading,
    error: listOfStudentsError,
    refetch,
  } = useQuery(courseQueries.allAnswerTask(isStudent ? null : id));

  const {
    data: authStudentAnswers,
    isLoading: authStudentAnswersLoading,
    error: authStudentAnswersError,
  } = useQuery(courseQueries.allStudentAnswers(isStudent ? id : null));
 

  if (!id) {
    return null;
  }

  if (isStudent) {
    return (
      <SingleStudentAnswers
        data={authStudentAnswers ?? []}
        isLoading={authStudentAnswersLoading}
        error={authStudentAnswersError}
        id={id}
        collapsible={collapsible}
        open={open}
        onOpenChange={onOpenChange}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {collapsible && (
        <button
          type="button"
          onClick={() => onOpenChange?.(!open)}
          className="flex min-h-10 w-full shrink-0 items-center justify-between gap-2 px-3 text-left active:bg-accent/50 lg:hidden lg:px-4"
        >
          <span className="truncate text-base font-semibold">
            Список студентов
          </span>
          <LuChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      )}
      {(!collapsible || open) && (
        <div className="h-full min-h-0 flex-1 overflow-auto px-3 pb-3 lg:px-4 sm:pb-4">
          <ListOfStudentsWithAnswers
            data={answersOfAllStudents ?? []}
            isLoading={isStudentsLoading}
            refetch={refetch}
            error={listOfStudentsError}
            theme_id={id}
          />
        </div>
      )}
    </div>
  );
};

export default ThemeAnswers;
