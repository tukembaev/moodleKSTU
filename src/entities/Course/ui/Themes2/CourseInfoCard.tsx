import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { LuInfo, LuUsers } from "react-icons/lu";

interface CourseInfoCardProps {
  title: string;
  content: string;
  icon?: "info" | "users";
}

export const CourseInfoCard: FC<CourseInfoCardProps> = ({
  title,
  content,
  icon = "info",
}) => {
  const IconComponent = icon === "users" ? LuUsers : LuInfo;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconComponent className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {content || "Информация не указана"}
        </p>
      </CardContent>
    </Card>
  );
};
