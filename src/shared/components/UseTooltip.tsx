import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/shadcn/ui/tooltip";

declare const SIDE_OPTIONS: readonly ["top", "right", "bottom", "left"];
type Side = (typeof SIDE_OPTIONS)[number];

const UseTooltip = ({
  children,
  text,
  side = "top",
}: {
  children: React.ReactNode;
  text: React.ReactNode;
  side?: Side;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}>
          {typeof text === 'string' ? <p>{text}</p> : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UseTooltip;
