import { TestList } from "entities/Test";
import { Outlet, useLocation } from "react-router-dom";

const TestingPage = () => {
  const location = useLocation();
  const isRootTestPage = location.pathname === "/test";
  return <div>{isRootTestPage ? <TestList /> : <Outlet />}</div>;
};

export default TestingPage;
