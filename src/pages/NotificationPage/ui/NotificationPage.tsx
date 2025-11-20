// import { useQuery } from "@tanstack/react-query";
// import { userQueries } from "entities/User";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "shared/shadcn/ui/resizable";
import { Button } from "shared/shadcn/ui/button";
import { NotificationDetail, NotificationList } from "widgets/Notification";

const NotificationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // const { data: notifications, isLoading, error } = useQuery(
  //   userQueries.user_notifications()
  // );

  // if (isLoading) {
  //   return <div>Загрузка...</div>;
  // }

  // if (error) {
  //   return <div>Ошибка: {error.message}</div>;
  // }
  // console.log(notifications)

  const handleBackToList = () => {
    navigate("/notification");
  };

  return (
    <>
      {/* Desktop view with ResizablePanelGroup */}
      <div className="hidden md:block h-full w-full">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel
            defaultSize={60}
            minSize={30}
            className="min-w-[300px] flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <NotificationList />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={40}
            minSize={30}
            className="min-w-[400px] flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <NotificationDetail />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile view - show list or detail */}
      <div className="md:hidden h-full w-full flex flex-col">
        {id ? (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="sticky top-0 z-10 bg-background border-b p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к списку
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NotificationDetail />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <NotificationList />
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPage;
