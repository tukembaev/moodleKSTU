import { useQuery } from "@tanstack/react-query";
import { useAuth } from "shared/hooks";
import { courseQueries } from "../../model/services/courseQueryFactory";
import ListOfStudentsWithAnswers from "./ListOfStudentsWithAnswers";
import SingleStudentAnswers from "./SingleStudentAnswers";

const ThemeAnswers = ({ id }: { id: string }) => {
  const { isStudent } = useAuth();
  const {
    data: answersOfAllStudents,
    isLoading: isStudentsLoading,
    error: listOfStudentsError,
    refetch,
  } = useQuery(courseQueries.allAnswerTask(isStudent ? null : id));
  console.log(answersOfAllStudents);
  const {
    data: authStudentAnswers,
    isLoading: authStudentAnswersLoading,
    error: authStudentAnswersError,
  } = useQuery(courseQueries.allStudentAnswers(isStudent ? id : null));
  console.log(authStudentAnswers);

  return (
    <>
      {answersOfAllStudents && (
        <ListOfStudentsWithAnswers
          data={answersOfAllStudents}
          isLoading={isStudentsLoading}
          refetch={refetch}
          error={listOfStudentsError}
          // count_students = {answersOfAllStudents.length}
        />
      )}
      {authStudentAnswers && (
        <SingleStudentAnswers
          data={authStudentAnswers}
          isLoading={authStudentAnswersLoading}
          error={authStudentAnswersError}
          id={id}
        />
      )}
    </>
  );
};

export default ThemeAnswers;
