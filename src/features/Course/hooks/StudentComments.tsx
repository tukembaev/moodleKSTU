import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { ReviewThread, mockReviews } from "./ReviewThread";

interface StudentCommentsProps {
  theme_id: string;
}

export function StudentComments({ theme_id }: StudentCommentsProps) {
  // TODO: Заменить на реальный API вызов
  // const { data: reviews, isLoading } = useQuery(
  //   courseQueries.themeReviews(theme_id)
  // );

  const themeReviews = mockReviews.filter((review) => review.theme_id === theme_id);

  const handleReply = (reviewId: string, message: string) => {
    // TODO: API call для ответа студента
    console.log("Student reply to review:", reviewId, "message:", message, "theme:", theme_id);
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

      {themeReviews.length === 0 ? (
        <div className="flex items-center justify-center py-12 rounded-lg border border-dashed">
          <p className="text-muted-foreground">Замечаний пока нет</p>
        </div>
      ) : (
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <ReviewThread
            reviews={themeReviews}
            onReply={handleReply}
            showStudentActions={true}
          />
        </ScrollArea>
      )}
    </div>
  );
}

