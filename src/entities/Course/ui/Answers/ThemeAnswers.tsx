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
    <ListOfStudentsWithAnswers
      data={answersOfAllStudents ?? []}
      isLoading={isStudentsLoading}
      refetch={refetch}
      error={listOfStudentsError}
      theme_id={id}
    />
  );
};

export default ThemeAnswers;
