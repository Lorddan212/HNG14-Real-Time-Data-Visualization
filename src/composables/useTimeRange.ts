import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboardStore';
import { TIME_RANGES } from '@/utils/constants';

export function useTimeRange() {
  const dashboard = useDashboardStore();
  const { filters } = storeToRefs(dashboard);

  const activeRange = computed(() => TIME_RANGES[filters.value.timeRange]);
  const rangeOptions = Object.entries(TIME_RANGES).map(([value, range]) => ({
    value,
    label: range.label,
  }));

  return {
    activeRange,
    rangeOptions,
  };
}
