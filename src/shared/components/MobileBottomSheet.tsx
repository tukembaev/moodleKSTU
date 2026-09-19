import type { ReactNode } from "react";
import { cn } from "shared/lib/utils";
import { Drawer } from "vaul";

interface MobileBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Подпись под заголовком. Если не задана — заголовок дублируется для скринридеров. */
  description?: string;
  /** Контент справа от заголовка (счётчики, бейджи) */
  headerAside?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * Нижний шит для мобильных: ручка для свайпа, липкий заголовок,
 * скроллящееся тело с учётом safe-area на устройствах с home indicator.
 */
export default function MobileBottomSheet({
  open,
  onOpenChange,
  title,
  description,
  headerAside,
  children,
  className,
  bodyClassName,
}: MobileBottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-51 flex max-h-[88dvh] flex-col rounded-t-2xl border-t bg-background outline-none",
            className
          )}
        >
          <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/25" />
          <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 pt-3 pb-3">
            <div className="min-w-0">
              <Drawer.Title className="truncate text-base font-semibold">
                {title}
              </Drawer.Title>
              <Drawer.Description
                className={cn(
                  "mt-0.5 text-xs text-muted-foreground",
                  !description && "sr-only"
                )}
              >
                {description || title}
              </Drawer.Description>
            </div>
            {headerAside}
          </div>
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom))]",
              bodyClassName
            )}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
