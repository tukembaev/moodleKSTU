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
    title: "Customizable Layouts",
    description:
      "Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds.",
  },
  {
    icon: Blocks,
    title: "Interactive Widgets",
    description:
      "Embed polls, quizzes, or forms to keep your audience engaged.",
  },
  {
    icon: Bot,
    title: "AI-Powered Tools",
    description:
      "Generate summaries, auto-format content, or translate into multiple languages seamlessly.",
  },
  {
    icon: Film,
    title: "Media Integrations",
    description:
      "Connect with Spotify, Instagram, or your own media library for dynamic visuals and sound.",
  },
  {
    icon: ChartPie,
    title: "Advanced Analytics",
    description:
      "Track engagement, clicks, and user activity with intuitive charts and reports.",
  },
  {
    icon: MessageCircle,
    title: "Seamless Collaboration",
    description:
      "Comment, tag, and assign tasks directly within your documents.",
  },
];

const GroupDetail = () => {
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

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto ">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col border rounded-xl py-6 px-5 justify-between"
            >
              <div>
                <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Badge className="bg-primary/5 text-primary shadow-none">
                    Technology
                  </Badge>
                  <span className="font-medium text-xs text-muted-foreground">
                    5 min read
                  </span>
                </div>
                <span className="text-lg font-semibold">{feature.title}</span>
                <p className="mt-1 text-foreground/80 text-[15px]">
                  {feature.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between align-middle">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <span className="text-muted-foreground font-semibold flex flex-col text-md">
                    John Doe
                    <span className="text-muted-foreground text-sm">
                      Nov 30, 2024
                    </span>
                  </span>
                </div>
                <Button className="shadow-none">
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

export default GroupDetail;
