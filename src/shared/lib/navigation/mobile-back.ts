import { useEffect, useRef } from "react";

type BackHandler = () => void;

const stack: BackHandler[] = [];

export function runMobileBackHandler(): boolean {
  const handler = stack[stack.length - 1];
  if (!handler) return false;
  handler();
  return true;
}

/** Перехватывает кнопку «Назад» в мобильной шапке, пока экран открыт. */
export function useMobileBackHandler(enabled: boolean, onBack: () => void) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!enabled) return;
    const handler = () => onBackRef.current();
    stack.push(handler);
    return () => {
      const index = stack.lastIndexOf(handler);
      if (index >= 0) stack.splice(index, 1);
    };
  }, [enabled]);
}
