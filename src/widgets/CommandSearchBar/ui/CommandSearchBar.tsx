import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "shared/shadcn/ui/command";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { cn } from "shared/lib/utils";
import { searchQueries } from "../model/globalSearchAPI";
import CoursesGroup from "./CommandGroups/CoursesGroup";
import EmployeesGroup from "./CommandGroups/EmployeesGroup";
import FilesGroup from "./CommandGroups/FilesGroup";
import StudyTasksGroup from "./CommandGroups/StudyTasksGroup";
import SearchLoader from "./SearchLoader";

interface CommandSearchBarProps {
  autoFocus?: boolean;
  onCollapse?: () => void;
  /** Список всегда раскрыт (мобильный шит) */
  alwaysOpen?: boolean;
  variant?: "card" | "plain";
}

function SearchHint() {
  const { t } = useTranslation();
  return (
    <Empty className="border-0 py-10">
      <EmptyContent>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>{t("Что можно найти")}</EmptyTitle>
        <EmptyDescription>
          {t(
            "Введите название курса, фамилию преподавателя или имя файла. Результаты появятся сразу — так быстрее, чем листать длинные списки."
          )}
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}

const CommandSearchBar = ({
  autoFocus,
  onCollapse,
  alwaysOpen = false,
  variant = "card",
}: CommandSearchBarProps) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(alwaysOpen);
  const query = text.trim();
  const { data, isLoading } = useQuery(searchQueries.searchResults(query));
  const showList = alwaysOpen || isActive;

  return (
    <Command
      className={cn(
        variant === "plain"
          ? "rounded-none border-0 bg-transparent shadow-none"
          : "z-50 rounded-lg border shadow-md md:min-w-[350px]",
        alwaysOpen && "h-full min-h-0"
      )}
    >
      <CommandInput
        autoFocus={autoFocus}
        value={text}
        onValueChange={setText}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (alwaysOpen) return;
          setTimeout(() => {
            setIsActive(false);
            onCollapse?.();
          }, 200);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (!alwaysOpen) {
              setIsActive(false);
              onCollapse?.();
            }
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder={t("Курс, преподаватель или файл")}
      />
      {showList &&
        (!query ? (
          <SearchHint />
        ) : (
          <CommandList
            className={cn(alwaysOpen && "max-h-none min-h-0 flex-1")}
          >
            {isLoading ? (
              <SearchLoader />
            ) : (
              <>
                <CommandEmpty>
                  {t(
                    "Ничего не найдено. Попробуйте другое название курса, фамилию или файл."
                  )}
                </CommandEmpty>
                <CoursesGroup data={data?.courses || []} />
                <EmployeesGroup data={data?.employees || []} />
                <FilesGroup data={data?.files || []} />
                <StudyTasksGroup data={data?.study_tasks || []} />
              </>
            )}
          </CommandList>
        ))}
    </Command>
  );
};

export default CommandSearchBar;
