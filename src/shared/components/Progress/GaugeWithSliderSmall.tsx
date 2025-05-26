import { Slider } from "shared/shadcn/ui/slider";

type GaugeProps = {
  score: number;
  maxScore: number;
  onChange?: (val: number) => void;
};

export function GaugeWithSliderSmall({
  score,
  maxScore,
  onChange,
}: GaugeProps) {
  const percentage = (score / maxScore) * 100;
  const dash = (percentage / 100) * 50;

  return (
    <div className="flex flex-col items-center gap-4 pt-2">
      {/* Gauge */}
      <div className="relative w-40 h-25">
        <svg
          className="rotate-180"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="1"
            strokeDasharray="50 100"
            strokeLinecap="round"
            className="stroke-current text-gray-200 dark:text-neutral-700"
          />
          {/* Progress */}
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
        <div className="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">
            {score}
          </span>
          <span className="text-sm text-blue-600 dark:text-blue-500 block">
            Баллов
          </span>
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
