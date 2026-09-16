export function sampleRandomIds(ids: string[], count: number): string[] {
  const n = Math.max(0, Math.min(Math.floor(count), ids.length));
  const pool = [...ids];
  for (let i = 0; i < n; i += 1) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    const current = pool[i];
    pool[i] = pool[j];
    pool[j] = current;
  }
  return pool.slice(0, n);
}
