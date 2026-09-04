import { TestList } from "entities/Test";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "shared/hooks";

const TestingPage = () => {
  const location = useLocation();
  const auth = useAuth();
  const isStudent = Boolean(auth?.isStudent);
  const isTestSubRoute =
    location.pathname.includes("/test/pass/") ||
    location.pathname.includes("/test/add-quiz") ||
    location.pathname.includes("/test/edit/") ||
    location.pathname.includes("/test/quiz-result/");

  if (isStudent && !isTestSubRoute) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div>
      {!isTestSubRoute ? (
        <div className="flex flex-col">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">Мои тесты</h2>
          <p className="mt-1.5 text-lg text-muted-foreground mb-2">
            Все тесты, которые вы создали или загружали
          </p>
          <TestList />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default TestingPage;
