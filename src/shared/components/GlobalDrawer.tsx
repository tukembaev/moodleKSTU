import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forms } from "shared/config";
import { useAuth } from "shared/hooks";
import { closeFormSearch } from "shared/hooks/useForm";
import { cn } from "shared/lib/utils";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { Drawer } from "vaul";

export default function GlobalDrawer() {
  const { isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const currentForm = useMemo(() => {
    const formTitle = searchParams.get("form");
    return forms.find((f) => formTitle?.startsWith(f.query)) || null;
  }, [searchParams]);

  useEffect(() => {
    setOpen(!!currentForm);
  }, [currentForm]);

  const handleClose = () => {
    setOpen(false);
    closeFormSearch(searchParams);
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  return (
    <Drawer.Root
      key={isMobile ? "bottom" : "right"}
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onClose={handleClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className={cn(
            "fixed z-41 flex outline-none min-w-0",
            isMobile
              ? "inset-x-0 bottom-0 max-h-[min(92dvh,100%)]"
              : "right-2 top-2 bottom-2 w-[min(440px,calc(100vw-1.5rem))] lg:w-[510px]"
          )}
          aria-describedby={undefined}
          style={
            isMobile
              ? undefined
              : ({
                  "--initial-transform": "calc(100% + 8px)",
                } as React.CSSProperties)
          }
        >
          <div
            className={cn(
              "bg-zinc-50 w-full grow flex flex-col overflow-y-auto overscroll-contain min-w-0 min-h-0",
              isMobile
                ? "rounded-t-2xl px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] max-h-[min(92dvh,100%)]"
                : "h-full rounded-[16px] p-4 lg:p-5"
            )}
          >
            {isMobile && (
              <div className="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300" />
            )}
            <Drawer.Title
              className={cn(
                "font-medium mb-2 text-zinc-900 break-words",
                isMobile ? "text-xl" : "text-2xl"
              )}
            >
              {currentForm?.title}
            </Drawer.Title>
            {/* если это студент и ему не разрешено то null , иначе всем можно пользоваться */}
            <div className="min-w-0 flex-1">
              {isStudent && !currentForm?.is_student_allow
                ? "Доступ студентам запрещен!"
                : currentForm?.form}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
