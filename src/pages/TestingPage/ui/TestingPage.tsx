import { TestList } from "entities/Test";
import { Outlet, useLocation } from "react-router-dom";

const TestingPage = () => {
  const location = useLocation();
  const isTestSubRoute = location.pathname.includes("/test/pass/") || 
                         location.pathname.includes("/test/result") ||
                         location.pathname.includes("/test/add-quiz") ||
                         location.pathname.includes("/test/quiz-result/");

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
