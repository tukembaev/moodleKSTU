import { TestList } from "entities/Test";
import { LuPlus } from "react-icons/lu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FormQuery, AppSubRoutes, RoutePath } from "shared/config";
import { useForm } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";

const TestingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootTestPage = location.pathname === "/test";
  const openForm = useForm();

  return (
    <div>
      {isRootTestPage ? (
        <div className="flex flex-col gap-4">
          <TestList />
          {/* <Quiz /> */}
          <button onClick={() => openForm(FormQuery.ADD_QUIZ)}>
            <LuPlus size={28} className="text-muted-foreground w-24" />
          </button>
          <Button
            onClick={() => navigate(`${RoutePath[AppSubRoutes.TEST_QUIZ]}`.replace(":id", "quiz_123456789"))}
            variant="outline"
            className="w-fit"
          >
            Пройти тест (quiz_123456789)
          </Button>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default TestingPage;
