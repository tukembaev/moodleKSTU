import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseOwner } from "entities/Course/model/types/course";
import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  LucideEdit,
  LucideIcon,
  Star,
  Users,
} from "lucide-react";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Textarea } from "shared/shadcn/ui/textarea";

const isBlank = (value?: string | null) => !value?.trim();

type EmptyCopy = {
  title: string;
  description: string;
};

const EMPTY_COPY = {
  description: {
    title: "Описание курса пока не заполнено",
    description:
      "Преподаватель ещё не рассказал, о чём этот курс, какие темы будут изучаться и какие результаты вы получите. Когда раздел заполнят, здесь появится подробное описание дисциплины.",
  },
  audience: {
    title: "Аудитория курса не указана",
    description:
      "Пока нет сведений о том, для кого предназначен курс: студентов какого курса, направления или уровня подготовки. Эта информация появится, когда преподаватель заполнит раздел.",
  },
  requirements: {
    title: "Требования к курсу не указаны",
    description:
      "Преподаватель ещё не описал, какие знания, навыки или материалы понадобятся перед началом обучения. Как только требования будут добавлены, вы увидите их в этом блоке.",
  },
} as const satisfies Record<string, EmptyCopy>;

const AboutBlock: FC<{
  field: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  value: string;
  isEdit?: boolean;
  empty: EmptyCopy;
  titleClassName?: string;
  onChange: (value: string) => void;
}> = ({
  field,
  title,
  subtitle,
  icon: Icon,
  value,
  onChange,
  isEdit = false,
  empty,
  titleClassName,
}) => {
  const { id } = useParams();
  const { mutate: edit_detail } = courseQueries.edit_details();

  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  const handleSave = () => {
    onChange(draftValue);
    edit_detail({
      id: id || "",
      data: {
        [field]: draftValue,
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftValue(value);
    setIsEditing(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <CardTitle className={titleClassName ?? "flex items-center gap-2"}>
              <Icon className="h-5 w-5 text-primary shrink-0" />
              {title}
            </CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          {isEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
              onClick={() => {
                setDraftValue(value);
                setIsEditing((prev) => !prev);
              }}
            >
              <LucideEdit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Textarea
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              className="min-h-[140px] resize-none"
              placeholder="Заполните этот раздел для студентов"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Сохранить
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Отменить
              </Button>
            </div>
          </div>
        ) : isBlank(value) ? (
          <Empty className="border border-dashed p-6 md:p-8 min-h-[160px]">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Icon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>{empty.title}</EmptyTitle>
              <EmptyDescription>{empty.description}</EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <p className="whitespace-pre-line text-sm sm:text-base text-muted-foreground leading-relaxed">
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const InstructorCard: FC<{ instructor: CourseOwner }> = ({ instructor }) => {
  const initials = instructor.owner_name
    ?.split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GraduationCap className="h-5 w-5 text-primary" />
          Преподаватель
        </CardTitle>
        <CardDescription>
          Контактное лицо курса и сведения о профиле
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center gap-4">
          <Avatar className="h-20 w-20 ring-2 ring-primary/10">
            <AvatarImage src={instructor.avatar} alt={instructor.owner_name} />
            <AvatarFallback className="text-base font-semibold bg-primary/10 text-primary">
              {initials || "П"}
            </AvatarFallback>
          </Avatar>

          <div className="w-full min-w-0 space-y-1">
            <h4 className="font-semibold text-base leading-tight">
              {instructor.owner_name || "Имя преподавателя не указано"}
            </h4>
            {instructor.position ? (
              <p className="text-sm text-muted-foreground">{instructor.position}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Должность в профиле пока не указана
              </p>
            )}
          </div>

          {(instructor.review?.rate > 0 || instructor.review?.count_courses > 0) && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {instructor.review?.rate > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {instructor.review.rate}
                </Badge>
              )}
              {instructor.review?.count_courses > 0 && (
                <Badge variant="outline" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  {instructor.review.count_courses} курсов
                </Badge>
              )}
            </div>
          )}

         
        </div>
      </CardContent>
    </Card>
  );
};

const isSameUserId = (left?: string | number | null, right?: string | number | null) => {
  if (left == null || right == null || left === "" || right === "") return false;
  const leftNum = Number(left);
  const rightNum = Number(right);
  if (Number.isFinite(leftNum) && Number.isFinite(rightNum) && leftNum > 0 && rightNum > 0) {
    return leftNum === rightNum;
  }
  return String(left) === String(right);
};

const AboutCourse = ({
  requirements: initialRequirements,
  description: initialDescription,
  audience: initialAudience,
  course_owner,
}: {
  requirements?: string;
  description?: string;
  audience?: string;
  course_owner?: CourseOwner | undefined;
}) => {
  const { id, isStudent, isAuthenticated } = useAuth();
  const isOwner =
    isSameUserId(course_owner?.user_id, id) ||
    isSameUserId(course_owner?.id, id) ||
    isSameUserId(course_owner?.owner, id);
  const canEdit = isOwner || (isAuthenticated && !isStudent);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [description, setDescription] = useState(initialDescription);
  const [audience, setAudience] = useState(initialAudience);

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="space-y-6">
          <AboutBlock
            field="description"
            title="Описание курса"
            subtitle="Цели дисциплины, содержание и ожидаемые результаты обучения"
            icon={FileText}
            value={description || ""}
            onChange={setDescription}
            isEdit={canEdit}
            empty={EMPTY_COPY.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AboutBlock
              field="audience"
              title="Для кого этот курс"
              subtitle="Кому будет полезно пройти обучение"
              icon={Users}
              value={audience || ""}
              onChange={setAudience}
              isEdit={canEdit}
              empty={EMPTY_COPY.audience}
              titleClassName="flex items-center gap-2 text-base"
            />

            <AboutBlock
              field="requirements"
              title="Требования"
              subtitle="Что нужно знать и подготовить заранее"
              icon={ClipboardList}
              value={requirements || ""}
              onChange={setRequirements}
              isEdit={canEdit}
              empty={EMPTY_COPY.requirements}
              titleClassName="flex items-center gap-2 text-base"
            />
          </div>
        </div>

        {course_owner ? (
          <InstructorCard instructor={course_owner} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-5 w-5 text-primary" />
                Преподаватель
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Empty className="border border-dashed p-6">
                <EmptyContent>
                  <EmptyMedia variant="icon">
                    <GraduationCap className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>Преподаватель ещё не назначен</EmptyTitle>
                  <EmptyDescription>
                    Сведения о преподавателе курса пока не поступили. Когда
                    ответственный преподаватель будет указан, его профиль появится
                    в этом блоке.
                  </EmptyDescription>
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AboutCourse;
