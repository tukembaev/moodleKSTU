import { TestList } from "entities/Test";
import Quiz from "features/Quiz/ui/Quiz";
import { LuPlus } from "react-icons/lu";
import { Outlet, useLocation } from "react-router-dom";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";

const TestingPage = () => {
  const location = useLocation();
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
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default TestingPage;
