import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forms } from "shared/config";
import { useAuth } from "shared/hooks";
import { Drawer } from "vaul";

export default function GlobalDrawer() {
  const { isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
    searchParams.delete("form");
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  return (
    <Drawer.Root direction="right" open={open} onClose={handleClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed outline-none w-[510px] flex z-41 "
          aria-describedby={undefined}
          style={
            {
              "--initial-transform": "calc(100% + 8px)",
            } as React.CSSProperties
          }
        >
          <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px] overflow-y-auto">
            <Drawer.Title className="font-medium mb-2 text-zinc-900 text-2xl">
              {currentForm?.title}
            </Drawer.Title>
            {/* если это студент и ему не разрешено то null , иначе всем можно пользоваться */}
            {isStudent && !currentForm?.is_student_allow
              ? "Доступ студентам запрещен!"
              : currentForm?.form}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
