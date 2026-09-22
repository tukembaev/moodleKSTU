import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { isCourseArchived } from "entities/Course/model/types/course";
import {
  isAlreadyMemberJoinError,
  joinCourseByInvite,
} from "entities/Course/ui/invite/joinCourseByInvite";
import { useAuth } from "shared/hooks";
import {
  clearHiddenId,
  getHiddenId,
  isUuid,
  openCourse,
  parseCourseInviteIds,
  setHiddenId,
  useHiddenId,
} from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";

const CourseInvitePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id, courseId, linkId } = useParams();
  const [searchParams] = useSearchParams();
  const inviteCourseId = useHiddenId("inviteCourseId");
  const inviteLinkId = useHiddenId("inviteLinkId");
  const [joining, setJoining] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);

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

    const inviteId = nextCourseId || getHiddenId("inviteCourseId");
    if (!inviteId) {
      navigate("/courses", { replace: true });
      return;
    }
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [id, courseId, linkId, searchParams, isAuthenticated, navigate]);

  const { data: myCourses, isLoading: coursesLoading } = useQuery({
    ...courseQueries.allCourses(),
    enabled: Boolean(inviteCourseId) && isAuthenticated,
  });

  const { data: course } = useQuery({
    ...courseQueries.courseModules(inviteCourseId || null),
    enabled: Boolean(inviteCourseId) && isAuthenticated,
    retry: false,
  });

  const isMember =
    alreadyMember ||
    Boolean(myCourses?.some((item) => item.id === inviteCourseId));
  const archived = isCourseArchived(course);

  const courseName =
    course?.discipline_name ||
    myCourses?.find((item) => item.id === inviteCourseId)?.discipline_name ||
    "";

  const goToCourses = () => {
    clearHiddenId("inviteCourseId");
    clearHiddenId("inviteLinkId");
    navigate("/courses", { replace: true });
  };

  const goToCourse = () => {
    const targetId = inviteCourseId || getHiddenId("inviteCourseId");
    clearHiddenId("inviteCourseId");
    clearHiddenId("inviteLinkId");
    if (targetId) {
      openCourse(navigate, targetId, { replace: true });
      return;
    }
    navigate("/courses", { replace: true });
  };

  const onJoin = async () => {
    const nextCourseId = inviteCourseId || getHiddenId("inviteCourseId");
    const nextLinkId = inviteLinkId || getHiddenId("inviteLinkId");
    if (!nextCourseId || !nextLinkId) {
      toast.error("Недействительная ссылка приглашения");
      return;
    }
    if (archived) {
      toast.error("Этот курс находится в архиве");
      return;
    }
    setJoining(true);
    try {
      await joinCourseByInvite({
        course_id: nextCourseId,
        link_id: nextLinkId,
      });
      await queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success("Заявка на вступление отправлена");
      goToCourses();
    } catch (error: unknown) {
      if (isAlreadyMemberJoinError(error)) {
        setAlreadyMember(true);
        toast.error("Вы уже состоите в этом курсе");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Не удалось отправить заявку";
      if (message === "Вы уже состоите в этом курсе") {
        setAlreadyMember(true);
      }
      toast.error(message);
    } finally {
      setJoining(false);
    }
  };

  if (!isAuthenticated || !inviteCourseId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Приглашение на курс</CardTitle>
          <CardDescription>
            {archived
              ? `Курс${courseName ? ` «${courseName}»` : ""} находится в архиве и больше недоступен.`
              : isMember
              ? `Вы уже состоите${courseName ? ` в курсе «${courseName}»` : " в этом курсе"}.`
              : `Вас пригласили вступить на курс${courseName ? ` «${courseName}»` : ""}. Нажмите «Присоединиться», чтобы отправить заявку.`}
          </CardDescription>
        </CardHeader>
        {coursesLoading ? (
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        ) : null}
        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {archived ? (
            <Button variant="outline" onClick={goToCourses}>
              К курсам
            </Button>
          ) : isMember ? (
            <Button variant="outline" onClick={goToCourse} disabled={joining}>
              Перейти к курсу
            </Button>
          ) : (
            <Button variant="outline" onClick={goToCourses} disabled={joining}>
              К курсам
            </Button>
          )}
          {!archived && (
            <Button
              onClick={isMember ? undefined : onJoin}
              disabled={isMember || joining || !inviteLinkId || coursesLoading}
            >
              {isMember
                ? "Вы уже состоите"
                : joining
                  ? "Отправка..."
                  : "Присоединиться"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseInvitePage;
