// import { useQuery } from "@tanstack/react-query";
// import { userQueries } from "entities/User";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "shared/shadcn/ui/resizable";
import { NotificationDetail, NotificationList } from "widgets/Notification";

const NotificationPage = () => {
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

  return (
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
  );
};

export default NotificationPage;
