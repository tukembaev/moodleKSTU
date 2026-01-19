import { useQuery } from "@tanstack/react-query";
import { RemarksList, remarkQueries } from "entities/Remarks";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";


interface StudentRemarksProps {
  theme_id: string;
}

export function StudentRemarks({ theme_id }: StudentRemarksProps) {
  const { data: remarks = [], isLoading } = useQuery(remarkQueries.remarksByTheme(theme_id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[435px]">
        <span className="text-gray-500">Загрузка замечаний...</span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[435px] p-2">
      <RemarksList remarks={remarks} showTabs={false} />
    </ScrollArea>
  );
}

