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
        <TabsList className="p-0 bg-background justify-start rounded-none gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary cursor-pointer"
            >
              <p className="text-[13px] flex gap-2 items-center">
                {tab.icon}
                {tab.name}
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
