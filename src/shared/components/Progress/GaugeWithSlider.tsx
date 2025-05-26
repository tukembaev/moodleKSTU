import { Slider } from "shared/shadcn/ui/slider";

type GaugeProps = {
  score: number;
  maxScore: number;
  onChange?: (val: number) => void;
};

export function GaugeWithSlider({ score, maxScore, onChange }: GaugeProps) {
  const percentage = (score / maxScore) * 100;
  const dash = (percentage / 100) * 75;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge */}
      <div className="relative size-40">
        <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="1.5"
            strokeDasharray="75 100"
            strokeLinecap="round"
            className="stroke-current text-gray-200 dark:text-neutral-700"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="1.5"
            strokeDasharray={`${dash} 100`}
            strokeLinecap="round"
            className="stroke-current text-blue-600 dark:text-blue-500"
          />
        </svg>

        {/* Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-500">
            {score}
          </span>
          <span className="text-blue-600 dark:text-blue-500 block">Score</span>
        </div>
      </div>

      {/* Slider */}
      <Slider
        max={maxScore}
        value={[score]}
        onValueChange={([val]) => onChange?.(val)}
        className="w-40"
      />
    </div>
  );
}
