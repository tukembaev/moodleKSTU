import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { Button } from "shared/shadcn/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Empty className="max-w-md border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldOff />
          </EmptyMedia>
          <EmptyTitle>У вас нет доступа</EmptyTitle>
          <EmptyDescription>
            Эта страница недоступна для вашей учётной записи.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={() => navigate(RoutePath[AppRoutes.COURSES])}
            className="cursor-pointer"
          >
            На главную
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
