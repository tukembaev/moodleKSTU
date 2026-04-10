import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseOwner } from "entities/Course/model/types/course";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  FileVideo,
  GraduationCap,
  Infinity,
  LucideEdit,
  Mail,
  MessageCircle,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import {
  mockCourseAboutData,
  getLevelColor,
  type CourseAboutData,
} from "shared/mocks/aboutCourseMock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
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
import { Progress } from "shared/shadcn/ui/progress";
import { Separator } from "shared/shadcn/ui/separator";

// Маппинг иконок
const iconMap: Record<string, React.ElementType> = {
  Clock,
  BookOpen,
  FileVideo,
  FileText,
  Award,
  Infinity,
};

// Компонент для редактируемых секций
export const Section: FC<{
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
      <div className="flex gap-2 sm:gap-3 items-center mb-3">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
          {title}
        </h3>
        {isEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0 h-8 w-8"
            onClick={() => setIsEditing(!isEditing)}
          >
            <LucideEdit className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isEditing ? (
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

// Компонент карточки характеристики
const FeatureCard: FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const IconComponent = iconMap[icon] || BookOpen;
  
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
};

// Компонент статистики курса
const CourseStatsCard: FC<{ stats: CourseAboutData["stats"] }> = ({ stats }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          Статистика курса
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-1 text-2xl font-bold text-primary">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            {stats.averageRating}
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {stats.totalReviews} отзывов
          </span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-1 text-2xl font-bold text-primary">
            <Users className="h-5 w-5" />
            {stats.totalStudents.toLocaleString()}
          </div>
          <span className="text-xs text-muted-foreground mt-1">студентов</span>
        </div>
        
        <div className="col-span-2 p-3 rounded-lg bg-background/60 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Завершаемость</span>
            <span className="text-sm font-bold text-primary">{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </div>
        
        <div className="col-span-2 flex justify-between text-sm text-muted-foreground">
          <span>Обновлено: {new Date(stats.lastUpdated).toLocaleDateString('ru-RU')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Компонент преподавателя (компактный для правой колонки)
const InstructorCard: FC<{ instructor: CourseAboutData["instructors"][0] }> = ({
  instructor,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 ring-2 ring-primary/10 shrink-0">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
              {instructor.name.split(' ').map(n => n[0]).join('')}
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
                  </Button>
                )}
                {instructor.socialLinks.telegram && (
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MessageCircle className="h-3.5 w-3.5" />
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

// Компонент сертификата
const CertificateCard: FC<{ certificate: CourseAboutData["certificate"] }> = ({
  certificate,
}) => {
  if (!certificate.available) return null;
  
  return (
    <Card className="overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-1">{certificate.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {certificate.description}
            </p>
            <div className="space-y-2">
              {certificate.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
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
  const { id } = useAuth();
  const isOwner = course_owner?.user_id === id;
  const [requirements, setRequirements] = useState(initialRequirements);
  const [description, setDescription] = useState(initialDescription);
  const [audience, setAudience] = useState(initialAudience);

  // Используем мок данные
  const courseData = mockCourseAboutData;

  return (
    <div className="py-4 space-y-8">
      {/* Характеристики курса */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Характеристики курса
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courseData.features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* Основная информация и статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Описание */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Описание курса
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Section
                field="description"
                title=""
                value={description || "Автор еще не добавил описание курса. Здесь будет подробное описание того, что вы изучите."}
                onChange={setDescription}
                isEdit={isOwner}
              />
            </CardContent>
          </Card>

          {/* Чему вы научитесь */}
          <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                Чему вы научитесь
              </CardTitle>
              <CardDescription>
                Навыки и компетенции, которые вы получите
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courseData.learningOutcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/60 hover:bg-background transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{outcome.title}</p>
                      {outcome.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {outcome.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Для кого этот курс */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Для кого этот курс?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getLevelColor(courseData.level.level)}>
                  {courseData.level.label}
                </Badge>
                <Badge variant="outline">{courseData.language}</Badge>
                {courseData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Section
                field="audience"
                title=""
                value={audience || "Курс предназначен для студентов, которые хотят получить практические навыки в данной области."}
                onChange={setAudience}
                isEdit={isOwner}
              />
            </CardContent>
          </Card>

          {/* Требования */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Требования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Section
                field="requirements"
                title=""
                value={requirements || "Базовые знания по предмету. Желание учиться и развиваться."}
                onChange={setRequirements}
                isEdit={isOwner}
              />
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - статистика и дополнительная информация */}
        <div className="space-y-6">
          <CourseStatsCard stats={courseData.stats} />
          <CertificateCard certificate={courseData.certificate} />
          
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
                courseData.instructors.map((instructor) => (
                  <InstructorCard key={instructor.id} instructor={instructor} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          Часто задаваемые вопросы
        </h2>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {courseData.faq.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutCourse;
