import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { remarksQueries } from "entities/Remarks";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { ReviewThread, remarkToReview } from "./ReviewThread";

interface StudentCommentsProps {
  theme_id: string;
}

export function StudentComments({ theme_id }: StudentCommentsProps) {
  const { data: remarks, isLoading } = useQuery(
    remarksQueries.byTheme(theme_id)
  );

  const { mutate: addMessage } = remarksQueries.add_message();

  const reviews = useMemo(
    () => (remarks ?? []).map(remarkToReview),
    [remarks]
  );

  const handleReply = (reviewId: string, message: string) => {
    if (!message.trim()) return;
    addMessage({ id: reviewId, data: { message } });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Замечания преподавателя</h3>
          <p className="text-sm text-muted-foreground">
            Здесь отображаются все замечания к вашей работе
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-2">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex items-center justify-center py-12 rounded-lg border border-dashed">
          <p className="text-muted-foreground">Замечаний пока нет</p>
        </div>
      ) : (
       
          <ReviewThread
            reviews={reviews}
            onReply={handleReply}
            showStudentActions={true}
          />
      
      )}
    </div>
  );
}
