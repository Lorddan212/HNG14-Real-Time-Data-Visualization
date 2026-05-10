export function appendLimited<T>(items: T[], next: T, limit: number): T[] {
  if (items.length >= limit) {
    return [...items.slice(items.length - limit + 1), next];
  }

  return [...items, next];
}

export function prependLimited<T>(items: T[], next: T, limit: number): T[] {
  if (items.length >= limit) {
    return [next, ...items.slice(0, limit - 1)];
  }

  return [next, ...items];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createRafBatcher<T>(flush: (items: T[]) => void) {
  let frameId: number | null = null;
  let queue: T[] = [];

  const cancel = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    queue = [];
  };

  const schedule = (item: T) => {
    queue.push(item);

    if (frameId !== null) {
      return;
    }

    frameId = requestAnimationFrame(() => {
      const pending = queue;
      queue = [];
      frameId = null;
      flush(pending);
    });
  };

  return { schedule, cancel };
}
