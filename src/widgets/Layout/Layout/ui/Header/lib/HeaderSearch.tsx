import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { CommandSearchBar } from "widgets/CommandSearchBar";

export function HeaderSearch() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("Поиск")}
        onClick={() => setIsOpen(true)}
      >
        <Search />
      </Button>
    );
  }

  return (
    <div className="max-h-[35px] flex">
      <CommandSearchBar
        autoFocus
        onCollapse={() => setIsOpen(false)}
      />
    </div>
  );
}
