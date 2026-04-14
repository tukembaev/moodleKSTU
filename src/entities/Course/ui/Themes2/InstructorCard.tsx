import { FC } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "shared/shadcn/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Badge } from "shared/shadcn/ui/badge";
import { Star, BookOpen, Mail, MessageCircle, MapPin } from "lucide-react";
import { CourseOwner } from "entities/Course/model/types/course";

interface InstructorCardProps {
  instructor: CourseOwner;
}

export const InstructorCard: FC<InstructorCardProps> = ({ instructor }) => {
  const initials = instructor.owner_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="w-full text-center">
      <CardHeader className="pb-0">
        <div className="flex flex-col items-center gap-4">
          {/* Большой аватар */}
          <Avatar className="size-24">
            <AvatarImage 
              src={instructor.avatar} 
              alt={instructor.owner_name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Имя и должность */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-semibold">{instructor.owner_name}</h3>
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            </div>
            {instructor.position && (
              <p className="text-sm text-muted-foreground">
                {instructor.position}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Биография */}
        {instructor.bio && (
          <p className="text-sm text-muted-foreground">
            {instructor.bio}
          </p>
        )}

        {/* Статистика */}
        <div className="flex justify-center gap-6 text-sm">
          {instructor.review?.rate && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{instructor.review.rate}</span>
              </div>
              <span className="text-xs text-muted-foreground">Рейтинг</span>
            </div>
          )}
          
          {instructor.review?.count_courses !== undefined && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{instructor.review.count_courses}</span>
              </div>
              <span className="text-xs text-muted-foreground">Курсов</span>
            </div>
          )}
        </div>

        {/* Контактная информация */}
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            <span>КГТУ им. И. Раззакова</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="size-3.5" />
            <span className="truncate">contact@kstu.kg</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Написать
        </Button>
        <Button variant="outline" className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      </CardFooter>
    </Card>
  );
};
