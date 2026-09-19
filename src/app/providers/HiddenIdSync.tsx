import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  captureHiddenIdsFromLocation,
  COURSE_THEMES_PATH,
  getHiddenId,
  isCourseInvitePath,
  QUESTION_BANK_DETAIL_PATH,
  TEST_EDIT_PATH,
  TEST_PASS_PATH,
  TEST_QUIZ_PATH,
  TEST_QUIZ_RESULT_PATH,
} from "shared/lib/navigation/hidden-ids";
import { getActiveContext, hasAuthSession } from "shared/lib/auth";

function isAuthed() {
  return hasAuthSession() && Boolean(getActiveContext());
}

export function HiddenIdSync({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const lastLocation = useRef("");
  const locationKey = `${location.pathname}${location.search}`;

  if (lastLocation.current !== locationKey) {
    lastLocation.current = locationKey;
    captureHiddenIdsFromLocation(location.pathname, location.search);
  }

  useLayoutEffect(() => {
    const captured = captureHiddenIdsFromLocation(
      location.pathname,
      location.search
    );
    let pathname = captured.pathname;
    let search = captured.search;
    let changed = captured.changed;

    if (isCourseInvitePath(location.pathname) && !isAuthed()) {
      pathname = "/";
      search = "";
      changed = true;
    }

    if (changed) {
      navigate({ pathname, search }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (location.pathname === COURSE_THEMES_PATH && !getHiddenId("courseId")) {
      navigate("/courses", { replace: true });
      return;
    }

    if (isCourseInvitePath(location.pathname)) {
      if (!getHiddenId("inviteCourseId")) {
        navigate("/courses", { replace: true });
        return;
      }
      if (!isAuthed()) {
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
      return;
    }

    if (
      location.pathname === QUESTION_BANK_DETAIL_PATH &&
      !getHiddenId("bankId")
    ) {
      navigate("/question-bank", { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}
