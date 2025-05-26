import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseOwner } from "entities/Course/model/types/course";
import { LucideEdit } from "lucide-react";
import { FC, useState } from "react";
import { LuAward, LuBookA, LuStar } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";

const Section: FC<{
  field: string;
  title: string;
  value: string;
  isEdit?: boolean;
  onChange: (value: string) => void;
}> = ({ field, title, value, onChange, isEdit = false }) => {
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
    <div className="flex flex-col">
      <div className="flex gap-3 items-center">
        <h1 className="text-3xl font-regular tracking-tight pt-1 mb-4">
          {title}
        </h1>
        {isEdit && (
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setIsEditing(!isEditing)}
          >
            <LucideEdit className="h-5 w-5" />
          </Button>
        )}
      </div>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            className="border rounded-md p-2 resize-none"
          />
          <div className="flex gap-2 items-end">
            <Button onClick={handleSave} variant="default" className="w-24">
              Сохранить
            </Button>
            <Button onClick={handleCancel} variant="outline" className="w-24">
              Отменить
            </Button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-line">{value}</p>
      )}
    </div>
  );
};

const InstructorBlock: FC<{ course_owner: CourseOwner | undefined }> = ({
  course_owner,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl">{course_owner?.owner_name}</h2>
        <h3>{course_owner?.position}</h3>

        <div className="flex gap-2 items-center mt-2">
          <Avatar className="h-24 w-24 rounded-lg">
            <AvatarImage
              src={course_owner?.avatar}
              alt={course_owner?.avatar}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="flex gap-3 items-center">
              <LuStar /> {course_owner?.review.rate} Рейтинг
            </span>
            <span className="flex gap-3 items-center">
              <LuAward /> {course_owner?.review.count_reviews} отзывов
            </span>

            <span className="flex gap-3 items-center">
              <LuBookA /> {course_owner?.review.count_courses} курсов
            </span>
          </div>
        </div>
      </div>
      <span className="mt-8">{course_owner?.bio}</span>
    </div>
  );
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
  const { id } = useAuth();
  const isOwner = course_owner?.user_id === id;
  const [requirements, setRequirements] = useState(initialRequirements);
  const [description, setDescription] = useState(initialDescription);
  const [audience, setAudience] = useState(initialAudience);

  return (
    <div className="flex py-2">
      <div className="pr-8 flex flex-col gap-4 w-full">
        {/* <BuyCourse /> */}

        <Section
          field="description"
          title="Описание"
          value={description || "Автор еще не добавил описание"}
          onChange={setDescription}
          isEdit={isOwner}
        />

        <Section
          field="audience"
          title="Для кого этот курс?"
          value={audience || "Автор еще не добавил описание"}
          onChange={setAudience}
          isEdit={isOwner}
        />

        <Section
          field="requirements"
          title="Требования"
          value={requirements || "Автор еще не добавил описание"}
          onChange={setRequirements}
          isEdit={isOwner}
        />
        {/* 
        <Section
          title="Участники"
          value={participants}
          onChange={setParticipants}
        /> */}

        <InstructorBlock course_owner={course_owner} />
      </div>
    </div>
  );
};

export default AboutCourse;
