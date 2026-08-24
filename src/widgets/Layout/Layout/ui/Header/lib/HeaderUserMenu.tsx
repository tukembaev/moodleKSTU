import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Apple, Download, LogOutIcon, Share, Smartphone, UserCircleIcon } from "lucide-react";
import { useAuth } from "shared/hooks";
import { useInstallPrompt } from "shared/lib/pwa/useInstallPrompt";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

export function HeaderUserMenu() {
  const auth_data = useAuth();
  const { promptInstall, isInstalled } = useInstallPrompt();
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  const onExit = () => {
    localStorage.removeItem("auth_data");
    localStorage.removeItem("google_auth");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      await promptInstall();
    }
  };

  const initials =
    `${auth_data?.first_name?.[0] || ""}${auth_data?.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={auth_data?.avatar}
                alt={auth_data?.first_name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={auth_data?.avatar}
                  alt={auth_data?.first_name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {auth_data?.first_name} {auth_data?.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {auth_data?.email || ""}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <NavLink to="/profile" className="flex items-center gap-2">
                <UserCircleIcon />
                Профиль
              </NavLink>
            </DropdownMenuItem>
            {!isInstalled && (
              <DropdownMenuItem onClick={handleInstallClick}>
                {isIOS ? <Apple /> : <Smartphone />}
                Установить PWA
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onExit}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5" /> Установка на iPhone/iPad
            </DialogTitle>
            <DialogDescription>
              Чтобы установить приложение на ваш iPhone или iPad, выполните
              следующие действия:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-400">
                <Share className="w-5 h-5" />
              </div>
              <p className="text-sm">
                1. Нажмите кнопку <strong>"Поделиться"</strong> в нижней панели
                браузера Safari.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-400">
                <Download className="w-5 h-5" />
              </div>
              <p className="text-sm">
                2. Прокрутите меню вниз и выберите пункт{" "}
                <strong>"На экран «Домой»"</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 p-2 rounded-full text-white font-bold text-xs w-9 h-9 flex items-center justify-center">
                +
              </div>
              <p className="text-sm">
                3. Нажмите <strong>"Добавить"</strong> в верхнем правом углу.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
          >
            Понятно
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
