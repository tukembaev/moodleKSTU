import { useQuery } from "@tanstack/react-query";
import { hasDepartmentAccess } from "entities/User/lib/permissions";
import { userQueries } from "entities/User/model/userQueryFactory";
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MobileBottomSheet } from "shared/components";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { useAuth } from "shared/hooks";
import { mergeProfileIntoSession, performLogout } from "shared/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Skeleton } from "shared/shadcn/ui/skeleton";

interface MobileProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileProfileSheet({
  open,
  onOpenChange,
}: MobileProfileSheetProps) {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const { data: me, isLoading } = useQuery({
    ...userQueries.me(),
    enabled: auth.isAuthenticated,
  });
  const canSeeWorkload = hasDepartmentAccess(me?.permissions);

  useEffect(() => {
    if (!me) return;
    mergeProfileIntoSession({
      first_name: me.first_name,
      last_name: me.last_name,
      email: me.email,
      avatar: me.avatar_url,
      username: me.username,
    });
  }, [me]);

  const firstName = me?.first_name || auth?.first_name || "";
  const lastName = me?.last_name || auth?.last_name || "";
  const email = me?.email || auth?.email || "";
  const avatar = me?.avatar_url || auth?.avatar || "";
  const initials =
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";
  const displayName =
    `${firstName} ${lastName}`.trim() || me?.username || t("Профиль");

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("Аккаунт")}
      bodyClassName="p-3"
    >
      <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
        <Avatar className="size-12 rounded-xl">
          <AvatarImage src={avatar} alt={displayName} className="object-cover" />
          <AvatarFallback className="rounded-xl text-base">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          {isLoading && !me ? (
            <>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1.5 h-3 w-40" />
            </>
          ) : (
            <>
              <p className="truncate text-sm font-semibold">{displayName}</p>
              {email && (
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              )}
            </>
          )}
          <span className="mt-1.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {auth.isStudent ? t("Студент") : t("Преподаватель")}
          </span>
        </div>
      </div>

      <nav className="mt-3 overflow-hidden rounded-xl border">
        <MenuRow
          icon={CalendarDays}
          label={t("Сегодня")}
          onClick={() => go(RoutePath[AppRoutes.TODAY])}
        />
        <MenuRow
          icon={UserCircleIcon}
          label={t("Мой профиль")}
          onClick={() => go(RoutePath[AppRoutes.PROFILE])}
        />
        <MenuRow
          icon={BookOpen}
          label={t("Мои курсы")}
          onClick={() => go(RoutePath[AppRoutes.COURSES])}
        />
        {!auth.isStudent && canSeeWorkload && (
          <MenuRow
            icon={BriefcaseBusiness}
            label={t("Нагрузка")}
            onClick={() => go(RoutePath[AppRoutes.WORKLOAD])}
          />
        )}
      </nav>

      <button
        type="button"
        onClick={() => void performLogout({ redirect: true })}
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 text-sm font-medium text-destructive transition-colors active:bg-destructive/10"
      >
        <LogOutIcon className="size-4" />
        {t("Выйти")}
      </button>
    </MobileBottomSheet>
  );
}

interface MenuRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

function MenuRow({ icon: Icon, label, onClick }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center gap-3 px-3.5 text-left transition-colors [&:not(:last-child)]:border-b active:bg-accent/60"
    >
      <Icon className="size-4.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {label}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
