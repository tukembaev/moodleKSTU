import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import {
  getHiddenId,
  isUuid,
  setHiddenId,
} from "shared/lib/navigation/hidden-ids";
import { Loader2 } from "lucide-react";

const CourseInvitePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id && isUuid(id)) {
      setHiddenId("inviteCourseId", id);
      setHiddenId("courseId", id);
    }

    const inviteId = getHiddenId("inviteCourseId");
    if (!inviteId) {
      navigate("/courses", { replace: true });
      return;
    }
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [id, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default CourseInvitePage;
