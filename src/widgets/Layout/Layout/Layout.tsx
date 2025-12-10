import React, { FC, ReactNode, memo } from "react";
import { SidebarProvider } from "shared/shadcn/ui/sidebar";
import Header from "./ui/Header/Header";
import Sidebar from "./ui/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";

import { useAuth } from "shared/hooks";
import { Toaster } from "shared/shadcn/ui/sonner";
import { GlobalDrawer } from "shared/components";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  // Если это страница логина, показываем только содержимое без Header и Sidebar
  if (isLoginPage) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen w-full bg-background">
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
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "14rem",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex flex-grow">
          {auth && <Sidebar />}
          <div className="w-full">
            <Header />

            <div className={`${auth && "px-4 pt-4 pb-8"} overflow-hidden`}>
              {children}
            </div>
          </div>
        </div>
        {auth && (
          <>
            <GlobalDrawer />
          </>
        )}
        <Toaster
          richColors
          closeButton
          position="top-center"
          expand={false}
          className="z-80"
        />
      </div>
    </SidebarProvider>
  );
};

export default memo(Layout);
