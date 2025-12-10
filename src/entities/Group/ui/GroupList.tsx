import {
  Blocks,
  Bot,
  ChartPie,
  ChevronRight,
  Film,
  MessageCircle,
  Settings2,
} from "lucide-react";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";

const features = [
  {
    icon: Settings2,
    title: "ПИ-2-24",
    uspeh: "61",
    kolvo_student: "20",
  },
  {
    icon: Blocks,
    title: "ПИ-2-23",
    uspeh: "34",
    kolvo_student: "30",
  },
  {
    icon: Bot,
    title: "ИСТ-2-24",
    uspeh: "40",
    kolvo_student: "30",
  },
  {
    icon: Film,
    title: "ИВТ-2-24",
    uspeh: "29",
    kolvo_student: "40",
  },
  {
    icon: ChartPie,
    title: "ИБ-2-24",
    uspeh: "79",
    kolvo_student: "25",
  },
  {
    icon: MessageCircle,
    title: "ИБ-2-23",
    uspeh: "60",
    kolvo_student: "23",
  },
];

const GroupList = () => {
  return (
    <div className="min-h-screen flex py-3">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-left">
              Мои группы
            </h2>
            <p className="mt-1.5 text-lg text-muted-foreground">
              Все группы, которые связаны с вами
            </p>
          </div>
        </div>

        <div
          className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto 
        "
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col border rounded-xl py-6 px-5 justify-between min-w-[384px]"
            >
              <div>
                {/* <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                  <feature.icon className="h-6 w-6" />
                </div> */}
                <div className="flex items-center justify-between py-2">
                  <Badge className="bg-primary/5 text-primary shadow-none">
                    ПОКС
                  </Badge>
                </div>
                <span className="text-lg font-semibold">{feature.title}</span>
                <p className="mt-1 text-foreground/80 text-[15px]">
                  Успеваемость: {feature.uspeh}
                </p>
                <p className="mt-1 text-foreground/80 text-[15px]">
                  Количество студентов : {feature.kolvo_student}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between align-middle">
                <Button className="shadow-none items-end">
                  Read more <ChevronRight />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
