import { useEffect, useRef, useState } from "react";
import { LuClock } from "react-icons/lu";
import { cn } from "shared/lib/utils";

interface TimerProps {
  initialTime: number; // в секундах
  onTimeUp: () => void;
  isSubmitted: boolean;
  timeRef?: React.MutableRefObject<number>; // ref для синхронизации времени с родителем
}

export const Timer = ({ initialTime, onTimeUp, isSubmitted, timeRef }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Синхронизация времени с ref родителя
  useEffect(() => {
    if (timeRef) {
      timeRef.current = timeRemaining;
    }
  }, [timeRemaining, timeRef]);

  useEffect(() => {
    if (isSubmitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSubmitted, onTimeUp]);

  // Вычисление процента оставшегося времени
  const timePercentage = initialTime > 0 ? (timeRemaining / initialTime) * 100 : 0;
  const getTimerColor = () => {
    if (timePercentage > 50) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (timePercentage > 20) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200 animate-pulse";
  };

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 px-5 py-2.5 shadow-lg backdrop-blur-xl border transition-all duration-500",
        getTimerColor()
      )}
    >
      <LuClock className="w-5 h-5 animate-pulse" />
      <div className="flex flex-col items-center leading-none">
        <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Осталось</span>
        <span className="font-mono text-lg font-bold tabular-nums">
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
};

