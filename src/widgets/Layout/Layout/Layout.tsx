import { FC, ReactNode, memo } from "react";
import Header from "./ui/Header/Header";
import { MobileHeader } from "./ui/Header/MobileHeader";

import { useAuth } from "shared/hooks";
import { Toaster } from "shared/shadcn/ui/sonner";
import { GlobalDrawer } from "shared/components";
import { NotificationWebSocket } from "widgets/Notification/ui/NotificationWebSocket";
import { MobileBottomNav } from "./ui/MobileBottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
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
      <MobileHeader />
      {/* нижний отступ на мобильных освобождает место под фиксированную навигацию */}
      <div className="px-4 pt-3 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pt-4 md:pb-4 flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
      <MobileBottomNav />
      <GlobalDrawer />
      <NotificationWebSocket />
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
