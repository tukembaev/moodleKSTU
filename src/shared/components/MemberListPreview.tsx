import * as React from "react";
import { cn } from "shared/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";

type AvatarProps = React.ComponentProps<typeof Avatar>;

interface AvatarGroupProps extends React.ComponentProps<"div"> {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
}

const AvatarGroup = ({
  children,
  max,
  className,
  ...props
}: AvatarGroupProps) => {
  const totalAvatars = React.Children.count(children);
  const displayedAvatars = React.Children.toArray(children)
    .slice(0, max)
    .reverse();
  const remainingAvatars = max ? Math.max(totalAvatars - max, 1) : 0;

  return (
    <div
      className={cn("flex items-center flex-row-reverse", className)}
      {...props}
    >
      {remainingAvatars > 0 && (
        <Avatar className="-ml-2 hover:z-10 relative ring-2 ring-background">
          <AvatarFallback className="bg-muted-foreground text-white">
            +{remainingAvatars}
          </AvatarFallback>
        </Avatar>
      )}
      {displayedAvatars.map((avatar, index) => {
        if (!React.isValidElement(avatar)) return null;

        return (
          <div key={index} className="-ml-2 hover:z-10 relative">
            {React.cloneElement(avatar as React.ReactElement<AvatarProps>, {
              className: "ring-2 ring-background",
            })}
          </div>
        );
      })}
    </div>
  );
};

export default function MemberListPreview() {
  return (
    <AvatarGroup
      className="flex items-center bg-background rounded-full border p-1 shadow-sm pl-3"
      max={3}
    >
      <Avatar className="-ml-2 first:ml-0 cursor-pointer">
        <AvatarImage
          src="https://trybecoterie.com/wp-content/uploads/2024/03/GJxJVkrWcAA3jpo-1.jpeg"
          alt="@shadcn"
        />
        <AvatarFallback className="bg-indigo-500 text-white">CN</AvatarFallback>
      </Avatar>
      <Avatar className="-ml-2 first:ml-0 cursor-pointer">
        <AvatarImage
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt8UZ4zJxxr0WY4XKArCvxAilcWpTSJhd6JoeV4GQON3VV5-bPfxYz07MVEWmGtkh7yjg&usqp=CAU"
          alt="@shadcn"
        />
        <AvatarFallback className="bg-green-600 text-white">CN</AvatarFallback>
      </Avatar>

      <Avatar className="-ml-2 first:ml-0 cursor-pointer">
        <AvatarImage
          src="https://worldmusicviews.com/wp-content/uploads/2023/11/Screen-Shot-2023-11-01-at-3.00.38-PM-e1698880858725.png"
          alt="@shadcn"
        />
        <AvatarFallback className="bg-red-500 text-white">AB</AvatarFallback>
      </Avatar>
      <Avatar className="-ml-2 first:ml-0 cursor-pointer">
        <AvatarFallback className="bg-indigo-500 text-white">VK</AvatarFallback>
      </Avatar>
      <Avatar className="-ml-2 first:ml-0 cursor-pointer">
        <AvatarFallback className="bg-orange-500 text-white">RS</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  );
}
