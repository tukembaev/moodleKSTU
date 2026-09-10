import { BankList } from "entities/QuestionBank";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { QUESTION_BANK_DETAIL_PATH } from "shared/lib/navigation/hidden-ids";

const QuestionBankPage = () => {
  const location = useLocation();
  const auth = useAuth();
  const isStudent = Boolean(auth?.isStudent);
  const isBankDetail = location.pathname.startsWith(QUESTION_BANK_DETAIL_PATH);

  if (isStudent) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div>
      {!isBankDetail ? (
        <div className="flex flex-col">
          <h2 className="text-4xl font-semibold tracking-tight text-left sm:text-5xl">
            Коллекции вопросов
          </h2>
          <p className="mt-1.5 text-lg text-muted-foreground">
            Наборы вопросов, которые можно вставлять в тесты
          </p>
          <BankList />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default QuestionBankPage;
