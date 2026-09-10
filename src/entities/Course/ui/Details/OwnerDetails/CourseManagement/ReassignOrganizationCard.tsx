import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { userQueries } from "entities/User";
import { LuBuilding2, LuSave } from "react-icons/lu";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";

interface ReassignOrganizationCardProps {
  courseId: string;
}

export const ReassignOrganizationCard = ({
  courseId,
}: ReassignOrganizationCardProps) => {
  const { data: course } = useQuery(courseQueries.allTasks(courseId));
  const { data: me, isLoading: isMeLoading } = useQuery(userQueries.me());
  const { mutate: edit_detail, isPending } = courseQueries.edit_details();

  const departments = useMemo(() => {
    const employments = me?.employee_profile?.employments ?? [];
    const unique = new Map<string, string>();

    for (const job of employments) {
      if (!job.organization_id || unique.has(job.organization_id)) continue;
      unique.set(job.organization_id, job.organization_name);
    }

    if (course?.organization_id && !unique.has(course.organization_id)) {
      unique.set(
        course.organization_id,
        course.organization_name || course.organization_id
      );
    }

    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [me, course]);

  const currentOrganizationId = course?.organization_id ?? "";
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(
    currentOrganizationId
  );

  useEffect(() => {
    setSelectedOrganizationId(currentOrganizationId);
  }, [currentOrganizationId]);

  const isUnchanged =
    selectedOrganizationId === currentOrganizationId ||
    !selectedOrganizationId;
  const canSave = !isPending && !isUnchanged && departments.length > 0;

  const handleSave = () => {
    if (!canSave) return;

    const organization_name =
      departments.find((item) => item.id === selectedOrganizationId)?.name ??
      "";

    edit_detail({
      id: courseId,
      data: {
        organization_id: selectedOrganizationId,
        organization_name,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuBuilding2 className="h-5 w-5 text-primary" />
          Кафедра курса
        </CardTitle>
        <CardDescription>
          Переназначьте организацию, к которой относится этот курс.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="course-organization">Кафедра</Label>
          <Select
            value={selectedOrganizationId || undefined}
            onValueChange={setSelectedOrganizationId}
            disabled={isMeLoading || isPending || departments.length === 0}
          >
            <SelectTrigger id="course-organization" className="w-full">
              <SelectValue
                placeholder={
                  isMeLoading
                    ? "Загрузка кафедр..."
                    : departments.length === 0
                      ? "Нет доступных кафедр"
                      : "Выберите кафедру"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isMeLoading && departments.length === 0 && (
            <span className="text-xs text-muted-foreground">
              В профиле нет кафедр для привязки курса
            </span>
          )}
        </div>
        <Button onClick={handleSave} disabled={!canSave}>
          <LuSave />
          {isPending ? "Сохраняем..." : "Сохранить кафедру"}
        </Button>
      </CardContent>
    </Card>
  );
};
