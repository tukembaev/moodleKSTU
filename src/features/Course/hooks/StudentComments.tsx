import { mockRemarks, RemarksList } from "entities/Remarks";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";


interface StudentCommentsProps {
  theme_id: string;
}

export function StudentComments({ theme_id }: StudentCommentsProps) {
  // TODO: Заменить на реальный API вызов
  // const { data: reviews, isLoading } = useQuery(
  //   courseQueries.themeReviews(theme_id)
  // );

  // const themeReviews = mockReviews.filter((review) => review.theme_id === theme_id);


  return (

    <ScrollArea className="h-[500px] p-2">
      <RemarksList remarks={mockRemarks} showTabs={false} />
    </ScrollArea>


  );
}

