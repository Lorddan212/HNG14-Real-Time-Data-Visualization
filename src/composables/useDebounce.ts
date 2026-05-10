import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

export function useDebounce<T>(source: Ref<T>, delay = 220): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const stop = watch(source, (value) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      debounced.value = value;
      timer = null;
    }, delay);
  });

  onBeforeUnmount(() => {
    stop();
    if (timer) {
      clearTimeout(timer);
    }
  });

  return debounced;
}
