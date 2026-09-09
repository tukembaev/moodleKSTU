import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  captureHiddenIdsFromLocation,
  COURSE_INVITE_PATH,
  COURSE_THEMES_PATH,
  getHiddenId,
  TEST_EDIT_PATH,
  TEST_PASS_PATH,
  TEST_QUIZ_PATH,
  TEST_QUIZ_RESULT_PATH,
} from "shared/lib/navigation/hidden-ids";
import { getActiveContext, hasAuthSession } from "shared/lib/auth";

export function HiddenIdSync({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const captured = captureHiddenIdsFromLocation(
      location.pathname,
      location.search
    );
    if (captured.changed) {
      navigate(
        { pathname: captured.pathname, search: captured.search },
        { replace: true }
      );
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (location.pathname === COURSE_THEMES_PATH && !getHiddenId("courseId")) {
      navigate("/courses", { replace: true });
      return;
    }

    if (location.pathname === COURSE_INVITE_PATH) {
      if (!getHiddenId("inviteCourseId")) {
        navigate("/courses", { replace: true });
        return;
      }
      if (!hasAuthSession() || !getActiveContext()) {
        navigate("/", { replace: true });
      }
      return;
    }

    const testPages = [
      TEST_PASS_PATH,
      TEST_EDIT_PATH,
      TEST_QUIZ_PATH,
      TEST_QUIZ_RESULT_PATH,
    ];
    if (testPages.includes(location.pathname) && !getHiddenId("quizId")) {
      navigate("/test", { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}
