// Tremor Tracker [v0.1.3]

import { SetMark } from "features/Course";
import React from "react";
import { cx } from "../cx";

interface TrackerBlockProps {
  key?: string | number;
  color?: string;
  id?: string;
  isTest?: number | null;
  points?: number;
  max_points?: number;
  title?: string;
  hoverEffect?: boolean;
  defaultBackgroundColor?: string;
}

export function getPointColor(points: number, max = 12) {
  const percent = (points / max) * 100;

  if (percent === 100) return "bg-green-500";
  if (percent >= 75) return "bg-green-500";
  if (percent >= 50) return "bg-green-400";
  if (percent >= 25) return "bg-green-400";
  return "bg-gray-200";
}

const Block = ({
  color,
  points,
  title,
  isTest,
  id,
  max_points,
  defaultBackgroundColor,
  hoverEffect,
}: TrackerBlockProps) => {
  const blockContent = (
    <div className="relative size-full overflow-hidden px-[0.5px] transition first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px cursor-pointer group">
      <div
        className={cx(
          "size-full rounded-[1px]",
          color || defaultBackgroundColor,
          hoverEffect ? "hover:opacity-50" : ""
        )}
      />
      {typeof points === "number" && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-black opacity-100 pointer-events-none">
          {points}
        </span>
      )}
    </div>
  );

  return isTest === null || isTest ? (
    blockContent
  ) : (
    <SetMark
      text={title || ""}
      points={points}
      id={id}
      max_points={Number(max_points)}
    >
      {blockContent}
    </SetMark>
  );
};

Block.displayName = "Block";

interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrackerBlockProps[];
  defaultBackgroundColor?: string;
  hoverEffect?: boolean;
}

const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(
  (
    {
      data = [],
      defaultBackgroundColor = "bg-gray-400 dark:bg-gray-400",
      className,
      hoverEffect,

      ...props
    },
    forwardedRef
  ) => {
    return (
      <div
        ref={forwardedRef}
        className={cx("group flex h-8 gap-1 items-center", className)}
        {...props}
      >
        {data.map((props, index) => (
          <Block
            key={props.key ?? index}
            defaultBackgroundColor={defaultBackgroundColor}
            hoverEffect={hoverEffect}
            {...props}
          />
        ))}
      </div>
    );
  }
);

Tracker.displayName = "Tracker";

export { Tracker, type TrackerBlockProps };
