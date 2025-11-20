import React from "react";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";

interface UseTabsProps {
  tabs: {
    name: string;
    value: string;
    content: React.ReactNode;
    count?: number;
    icon: React.ReactNode;
  }[];
  classNames?: string;
  children?: React.ReactNode;
}

export default function UseTabs({ tabs, classNames, children }: UseTabsProps) {
  return (
    <Tabs defaultValue={tabs[0].value} className={`w-full ${classNames}`}>
      <div className="flex justify-between">
        <div className="overflow-x-auto flex-1 scrollbar-hide">
          <TabsList className="p-0 bg-background justify-start rounded-none gap-1 min-w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary cursor-pointer whitespace-nowrap"
              >
                <p className="text-xs sm:text-[13px] flex gap-1 sm:gap-2 items-center">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.name}</span>
                </p>
                {!!tab.count && (
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1 py-0 text-xs rounded-full"
                  >
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {children}
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
