import { useTranslation } from "react-i18next";
import { MobileBottomSheet } from "shared/components";
import { CommandSearchBar } from "widgets/CommandSearchBar";

interface MobileSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Поиск открывается снизу, как уведомления и профиль.
 * Инпут в шапке шита остаётся над клавиатурой за счёт repositionInputs у vaul.
 */
export function MobileSearchSheet({
  open,
  onOpenChange,
}: MobileSearchSheetProps) {
  const { t } = useTranslation();
  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("Поиск")}
      description={t("Найдите курс, преподавателя или файл")}
      className="h-[85dvh] max-h-[85dvh]"
      bodyClassName="flex min-h-0 flex-1 flex-col p-0"
    >
      {open && (
        <CommandSearchBar autoFocus alwaysOpen variant="plain" />
      )}
    </MobileBottomSheet>
  );
}
