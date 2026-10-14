import { useSyncExternalStore } from "react";

let wide = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setMaterialDrawerWide(next: boolean) {
  if (wide === next) return;
  wide = next;
  listeners.forEach((listener) => listener());
}

export function useMaterialDrawerWide() {
  return useSyncExternalStore(subscribe, () => wide, () => false);
}
