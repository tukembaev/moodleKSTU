import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import {
  getHiddenId,
  isUuid,
  parseCourseInviteIds,
  setHiddenId,
} from "shared/lib/navigation/hidden-ids";
import { Loader2 } from "lucide-react";

const CourseInvitePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id, courseId, linkId } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const parsed = parseCourseInviteIds(
      window.location.pathname,
      searchParams.toString()
    );
    const nextCourseId =
      parsed.courseId ||
      (courseId && isUuid(courseId) ? courseId : null) ||
      (id && isUuid(id) ? id : null);
    const nextLinkId =
      parsed.linkId || (linkId && isUuid(linkId) ? linkId : null);

    if (nextCourseId) {
      setHiddenId("inviteCourseId", nextCourseId);
      setHiddenId("courseId", nextCourseId);
    }
    if (nextLinkId) {
      setHiddenId("inviteLinkId", nextLinkId);
    }

    const inviteId = getHiddenId("inviteCourseId");
    if (!inviteId) {
      navigate("/courses", { replace: true });
      return;
    }
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [id, courseId, linkId, searchParams, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default CourseInvitePage;
