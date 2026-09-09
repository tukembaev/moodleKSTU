import { FC, ReactNode, memo } from "react";
import Header from "./ui/Header/Header";
import { useLocation } from "react-router-dom";

import { useAuth } from "shared/hooks";
import { Toaster } from "shared/shadcn/ui/sonner";
import { GlobalDrawer } from "shared/components";
import { NotificationWebSocket } from "widgets/Notification/ui/NotificationWebSocket";
import { CourseInviteJoinDialog } from "entities/Course/ui/invite/CourseInviteJoinDialog";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  if (isLoginPage) {
    return (
      <>
        <div className="flex min-h-dvh w-full items-center justify-center bg-background">
          {children}
        </div>
        <Toaster
          richColors
          closeButton
          position="top-center"
          expand={false}
          className="z-80"
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden">
      <Header />
      <div className={`${auth.isAuthenticated ? "px-4 pt-4 pb-4" : ""} flex-1 min-h-0 overflow-y-auto`}>
        {children}
      </div>
      {auth.isAuthenticated && (
        <>
          <GlobalDrawer />
          <NotificationWebSocket />
          <CourseInviteJoinDialog />
        </>
      )}
      <Toaster
        richColors
        closeButton
        position="top-right"
        expand={false}
        className="z-80"
      />
    </div>
  );
};

export default memo(Layout);
