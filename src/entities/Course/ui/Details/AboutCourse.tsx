import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";

import { CourseOwner } from "entities/Course/model/types/course";
import { CourseFAQ, CourseInstructor, LearningOutcome } from "entities/Course/model/types/courseAbout";
import {
  BookOpen,
  FileText,
  GraduationCap,
  LucideEdit,
  Mail,
  MessageCircle,
  Star
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
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import { FAQ, TestConditions, WhatYouWillLearn } from "./components";



// Компонент для редактируемых секций
export const Section: FC<{
  field: string;
  title: string;
  value: string;
  isEdit?: boolean;
  onChange: (value: string) => void;
  isEditing?: boolean;
  onEditChange?: (value: boolean) => void;
  hideHeader?: boolean;
}> = ({
  field,
  title,
  value,
  onChange,
  isEdit = false,
  isEditing: controlledIsEditing,
  onEditChange,
  hideHeader = false,
}) => {
    const { id } = useParams();
    const { mutate: edit_detail } = courseQueries.edit_details();

    const [localIsEditing, setLocalIsEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(value);

    const isEditingCurrent =
      controlledIsEditing !== undefined ? controlledIsEditing : localIsEditing;
    const setIsEditingCurrent = onEditChange || setLocalIsEditing;

    const handleSave = () => {
      onChange(draftValue);
      edit_detail({
        id: id || "",
        data: {
          [field]: draftValue,
        },
      });
      setIsEditingCurrent(false);
    };

    const handleCancel = () => {
      setDraftValue(value);
      setIsEditingCurrent(false);
    };

    return (
      <div className="flex flex-col">
        {!hideHeader && (
          <div className="flex gap-2 sm:gap-3 items-center mb-3">
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
              {title}
            </h3>
            {isEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground shrink-0 h-8 w-8"
                onClick={() => setIsEditingCurrent(!isEditingCurrent)}
              >
                <LucideEdit className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {isEditingCurrent ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              className="border rounded-lg p-3 resize-none min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <div className="flex gap-2 items-end">
              <Button onClick={handleSave} variant="default" size="sm">
                Сохранить
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Отменить
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
            {value}
          </p>
        )}
      </div>
    );
  };

const EditableCard: FC<{
  icon: React.ElementType;
  title: string;
  field: string;
  value: string;
  onChange: (value: string) => void;
  isOwner: boolean;
  children?: React.ReactNode;
}> = ({ icon: Icon, title, field, value, onChange, isOwner, children }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </div>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground shrink-0 h-8 w-8"
              onClick={() => setIsEditing(!isEditing)}
            >
              <LucideEdit className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        <Section
          field={field}
          title={title}
          value={value}
          onChange={onChange}
          isEdit={isOwner}
          isEditing={isEditing}
          onEditChange={setIsEditing}
          hideHeader={true}
        />
      </CardContent>
    </Card>
  );
};


// Компонент преподавателя (компактный для правой колонки)
const InstructorCard: FC<{ instructor: CourseInstructor }> = ({
  instructor,
}) => {
  console.log(instructor)
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 ring-2 ring-primary/10 shrink-0">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
              {instructor.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{instructor.name}</h4>
            <p className="text-xs text-muted-foreground mb-2 truncate">{instructor.position}</p>

            <div className="flex flex-wrap gap-1.5">
              {instructor.rating > 0 && (
                <Badge variant="secondary" className="gap-1 text-xs px-1.5 py-0">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {instructor.rating}
                </Badge>
              )}
              {instructor.coursesCount > 0 && (
                <Badge variant="outline" className="gap-1 text-xs px-1.5 py-0">
                  <BookOpen className="h-3 w-3" />
                  {instructor.coursesCount}
                </Badge>
              )}
            </div>

            {instructor.socialLinks && (
              <div className="flex gap-1 mt-2">
                {instructor.socialLinks.email && (
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${instructor.socialLinks.email}`}> {instructor.socialLinks.email} </a>
                  </Button>
                )}
                {instructor.socialLinks.telegram && (
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <a href={`https://t.me/${instructor.socialLinks.telegram}`}> {instructor.socialLinks.telegram} </a>
                  </Button>
                )}
              </div>    
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


// Главный компонент
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
  const { id: courseId } = useParams();
  const { id: userId } = useAuth();
  const isOwner = course_owner?.user_id === userId;
  const [requirements, setRequirements] = useState(initialRequirements);
  const [description, setDescription] = useState(initialDescription);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_audience, _setAudience] = useState(initialAudience);

  // Fetch course about data from API
  const { data: courseData, isLoading } = useQuery(courseQueries.courseAbout(courseId || null));
  
  // PATCH mutation for updating course about data
  const { mutate: updateCourseAbout } = courseQueries.update_course_about();

  // Handler for updating FAQ
  const handleFaqUpdate = (faq: CourseFAQ[]) => {
    if (!courseId) return;
    updateCourseAbout({
      courseId,
      data: { faq }
    });
  };

  // Handler for updating learning outcomes
  const handleLearningOutcomesUpdate = (learningOutcomes: LearningOutcome[]) => {
    if (!courseId) return;
    updateCourseAbout({
      courseId,
      data: { learningOutcomes }
    });
  };

  // Handler for updating test conditions
  const handleRulesUpdate = (requirements: string[]) => {
    if (!courseId || !courseData) return;
    updateCourseAbout({
      courseId,
      data: {
        rules: {
          ...courseData.rules,
          requirements
        }
      }
    });
  };

  if (isLoading) {
    return <div className="py-4 text-center">Загрузка...</div>;
  }

  if (!courseData) {
    return <div className="py-4 text-center">Данные не найдены</div>;
  }

  return (
    <div className="py-4 space-y-8">
      {/* Характеристики курса */}

      {/* Основная информация и статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Описание */}
          <EditableCard
            icon={FileText}
            title="Описание курса"
            field="description"
            value={
              description ||
              "Автор еще не добавил описание курса. Здесь будет подробное описание того, что вы изучите."
            }
            onChange={setDescription}
            isOwner={isOwner || false}
          />

          {/* Требования */}
          <EditableCard
            icon={FileText}
            title="Требования"
            field="requirements"
            value={
              requirements ||
              "Базовые знания по предмету. Желание учиться и развиваться."
            }
            onChange={setRequirements}
            isOwner={isOwner || false}
          />

          {/* FAQ */}
          <FAQ
            faq={courseData.faq}
            isOwner={isOwner || false}
            onSave={handleFaqUpdate}
          />
        </div>

        {/* Правая колонка - статистика и дополнительная информация */}
        <div className="space-y-6">
       
          <TestConditions
            rules={courseData.rules}
            isOwner={isOwner || false}
            onSave={handleRulesUpdate}
          />

          {/* Чему вы научитесь */}
          <WhatYouWillLearn
            outcomes={courseData.learningOutcomes}
            isOwner={isOwner || false}
            onSave={handleLearningOutcomesUpdate}
          />

          {/* Преподаватели курса */}
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Преподаватели
            </h3>
            <div className="space-y-3">
              {course_owner ? (
                <InstructorCard
                  instructor={{
                    id: course_owner.id,
                    name: course_owner.owner_name,
                    avatar: course_owner.avatar,
                    position: course_owner.position || "Преподаватель",
                    bio: course_owner.bio || "Опытный преподаватель КСТУ",
                    coursesCount: course_owner.review?.count_courses || 0,
                    studentsCount: 0,
                    rating: course_owner.review?.rate || 0,
                    socialLinks: {
                      email: "contact@kstu.kg",
                    },
                  }}
                />
              ) : (
                courseData.instructors.map((instructor: CourseInstructor) => (
                  <InstructorCard key={instructor.id} instructor={instructor} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCourse;
