import React, { FC, ReactNode, memo } from "react";
import { SidebarProvider } from "shared/shadcn/ui/sidebar";
import Header from "./ui/Header/Header";
import Sidebar from "./ui/Sidebar/Sidebar";

import { useAuth } from "shared/hooks";
import { Toaster } from "shared/shadcn/ui/sonner";
import { GlobalDrawer } from "shared/components";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();

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
        <Toaster richColors closeButton expand={false} className="z-80" />
      </div>
    </SidebarProvider>
  );
};

export default memo(Layout);
