import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseOwner } from "entities/Course/model/types/course";
import { LucideEdit } from "lucide-react";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
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
      <div className="flex gap-2 sm:gap-3 items-center">
        <h1 className="text-2xl sm:text-3xl font-regular tracking-tight pt-1 mb-4">
          {title}
        </h1>
        {isEdit && (
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground shrink-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <LucideEdit className="h-4 w-4 sm:h-5 sm:w-5" />
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
    <div className="flex flex-col sm:flex-row py-2 gap-4 sm:gap-2 w-full">
      <div className="pr-0 sm:pr-8 flex flex-col gap-4 w-full sm:min-w-[45%]">
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
        {/* <div>
          <h1 className="text-3xl font-regular tracking-tight pt-1 mb-4">
            Преподаватели курса
          </h1>
          <div className="flex gap-8 items-center">
            <InstructorBlock course_owner={course_owner} />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AboutCourse;
