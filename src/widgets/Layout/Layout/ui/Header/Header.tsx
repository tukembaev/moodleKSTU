import { useAuth } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import { CommandSearchBar } from "widgets/CommandSearchBar";

import { useLocation, useNavigate } from "react-router-dom";

import { SidebarTrigger } from "shared/shadcn/ui/sidebar";

import GuestNavigationMenu from "./lib/GuestNavigationMenu";
import logo from "/src/assets/logo.svg";


const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий путь
  const isLoginPage = location.pathname === "/";
  return (
    <header className="py-4 px-2 border-b w-full sticky top-0 z-30 bg-background">
      <div className="flex justify-between items-center mx-auto">
        {/* Left Section: Logo and Two Buttons */}
        {!auth ? (
          <div className="flex items-center gap-4">
            <img src={logo} className="w-8" alt="Logo" />
            <GuestNavigationMenu />
          </div>
        ) : (
          <div className="max-h-[35px] flex items-center">
            <div className="flex gap-1 items-center">
              {" "}
              <SidebarTrigger className="cursor-pointer relative" />
              {/* <Separator orientation="vertical" className="min-h-6 mr-2" /> */}
            </div>
          </div>
        )}

        {/* Right Section: Search and User Actions */}
        <div className="flex items-center gap-2">
          {!auth && !isLoginPage && (
            <div className="max-h-[35px] flex">
              <CommandSearchBar />
            </div>
          )}

          {auth ? (
            <>
              {/* <UserNotification /> */}
              <div className="max-h-[35px] flex">
                <CommandSearchBar />
              </div>


              {/* <UserBasket /> */}
              {/* <Balance value={100.99} prefix="$" className="mr-6" /> */}
            </>
          ) : !isLoginPage ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden sm:inline-flex rounded-md"
                onClick={() => navigate("/")}
              >
                Войти
              </Button>
              <Button className="rounded-md">Регистрация</Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
