import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_OPTIONS,
  type AppLanguage,
  isAppLanguage,
} from "shared/config/i18n/languages";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = isAppLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : "ru";
  const currentOption =
    LANGUAGE_OPTIONS.find((option) => option.code === current) ??
    LANGUAGE_OPTIONS[0];

  const onSelect = (code: AppLanguage) => {
    if (code === current) return;
    void i18n.changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("Язык")}
          className="relative"
        >
          <Languages className="size-4" />
          <span className="sr-only">{currentOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => onSelect(option.code)}
            className="flex items-center justify-between gap-3"
          >
            <span>
              <span className="mr-2 text-xs font-medium text-muted-foreground">
                {option.short}
              </span>
              {option.label}
            </span>
            {option.code === current && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
