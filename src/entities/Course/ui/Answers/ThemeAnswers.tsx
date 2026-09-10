import { useQuery } from "@tanstack/react-query";
import { useAuth } from "shared/hooks";
import { courseQueries } from "../../model/services/courseQueryFactory";
import ListOfStudentsWithAnswers from "./ListOfStudentsWithAnswers";
import SingleStudentAnswers from "./SingleStudentAnswers";

const ThemeAnswers = ({ id }: { id: string | null }) => {
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
      />
    );
  }

  return (
    <div className="h-full min-h-0 overflow-auto px-3 pb-3 sm:px-4 sm:pb-4">
      <ListOfStudentsWithAnswers
        data={answersOfAllStudents ?? []}
        isLoading={isStudentsLoading}
        refetch={refetch}
        error={listOfStudentsError}
        theme_id={id}
      />
    </div>
  );
};

export default ThemeAnswers;
