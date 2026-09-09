import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useAuth } from "shared/hooks";
import {
  clearHiddenId,
  COURSE_INVITE_PATH,
  getHiddenId,
  useHiddenId,
} from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";
import { joinCourseByInvite } from "./joinCourseByInvite";

export function CourseInviteJoinDialog() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const inviteCourseId = useHiddenId("inviteCourseId");
  const [open, setOpen] = useState(false);
  const [joining, setJoining] = useState(false);

  const { data: course } = useQuery({
    ...courseQueries.courseModules(inviteCourseId || null),
    enabled: Boolean(inviteCourseId) && isAuthenticated,
  });

  useEffect(() => {
    setOpen(Boolean(isAuthenticated && inviteCourseId));
  }, [isAuthenticated, inviteCourseId]);

  const closeInvite = () => {
    clearHiddenId("inviteCourseId");
    setOpen(false);
    if (window.location.pathname === COURSE_INVITE_PATH) {
      navigate("/courses", { replace: true });
    }
  };

  const onJoin = async () => {
    const courseId = inviteCourseId || getHiddenId("inviteCourseId");
    if (!courseId) return;
    setJoining(true);
    try {
      await joinCourseByInvite(courseId);
      toast.success("Заявка на вступление отправлена");
      closeInvite();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Не удалось отправить заявку";
      toast.error(message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeInvite();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Приглашение на курс</DialogTitle>
          <DialogDescription>
            Вас пригласили вступить на курс
            {course?.discipline_name ? ` «${course.discipline_name}»` : ""}.
            Нажмите «Присоединиться», чтобы отправить заявку.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeInvite} disabled={joining}>
            Отмена
          </Button>
          <Button onClick={onJoin} disabled={joining}>
            {joining ? "Отправка..." : "Присоединиться"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
