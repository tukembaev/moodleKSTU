import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "shared/shadcn/ui/button";
import { CommandSearchBar } from "widgets/CommandSearchBar";

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Поиск"
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
