import { FC, ReactNode, memo } from "react";

import Footer from "./ui/Footer/Footer";
import Header from "./ui/Header/Header";
import Sidebar from "./ui/Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="w-7/8 pt-4 px-4">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default memo(Layout);
