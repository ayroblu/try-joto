export function parsePath(path: string): {
  command: string;
  values: [number, number];
}[] {
  const parts = chunk(path.split(" ").filter(Boolean), 2);

  return parts.map(([x, y]) => {
    const xFloat = parseFloat(x.slice(1));
    const yFloat = parseFloat(y);
    if (isNaN(xFloat)) {
      console.log(xFloat, yFloat, x, y);
    }
    return { command: x.slice(0, 1), values: [xFloat, yFloat] };
  });
}
export function chunk<T>(arr: T[], chunkSize = 1, cache: T[][] = []): T[][] {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
}
