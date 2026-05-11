<template>
  <section class="control-panel" aria-label="Dashboard controls">
    <div class="control-panel__cluster">
      <Button
        :variant="isPaused ? 'primary' : 'secondary'"
        class="control-panel__button"
        :aria-label="isPaused ? 'Resume streaming' : 'Pause streaming'"
        @click="toggleStreaming"
      >
        <Play v-if="isPaused" :size="16" aria-hidden="true" />
        <Pause v-else :size="16" aria-hidden="true" />
        <span>{{ isPaused ? 'Resume' : 'Pause' }}</span>
      </Button>

      <Button variant="ghost" class="control-panel__button" aria-label="Simulate reconnect" @click="streamService.simulateReconnect()">
        <RefreshCcw :size="16" aria-hidden="true" />
        <span>Reconnect</span>
      </Button>

      <StatusBadge :status="stream.status" />
    </div>

    <div class="control-panel__cluster control-panel__cluster--fluid">
      <Input v-model="search" type="search" aria-label="Search activity" placeholder="Search logs, services, regions..." />

      <Select v-model="timeRangeModel" aria-label="Time range" :options="rangeOptions" />
      <Select v-model="severityModel" aria-label="Severity filter" :options="severityOptions" />
      <Select v-model="chartModeModel" aria-label="Chart mode" :options="chartModeOptions" />
    </div>

    <div class="control-panel__datasets" aria-label="Dataset visibility">
      <button
        v-for="dataset in datasetKeys"
        :key="dataset"
        class="dataset-chip"
        :class="{ 'dataset-chip--active': dashboard.visibleDatasets[dataset] }"
        type="button"
        @click="dashboard.toggleDataset(dataset)"
      >
        <span class="dataset-chip__dot" :class="`dataset-chip__dot--${dataset}`" />
        {{ datasetLabels[dataset] }}
      </button>
    </div>

    <div class="control-panel__cluster">
      <Button variant="ghost" size="icon" aria-label="Clear activity logs" @click="dashboard.clearEvents()">
        <Trash2 :size="17" aria-hidden="true" />
      </Button>

      <Button variant="ghost" size="icon" :aria-label="theme.isDark ? 'Use light mode' : 'Use dark mode'" @click="theme.toggle()">
        <Sun v-if="theme.isDark" :size="17" aria-hidden="true" />
        <Moon v-else :size="17" aria-hidden="true" />
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Moon, Pause, Play, RefreshCcw, Sun, Trash2 } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import StatusBadge from '@/components/dashboard/StatusBadge.vue';
import { useDebounce } from '@/composables/useDebounce';
import { streamService } from '@/services/streamService';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import { useThemeStore } from '@/stores/themeStore';
import type { ChartMode, DashboardFilters, DatasetKey } from '@/types/metrics';
import type { SeverityLevel } from '@/types/events';
import { DATASET_LABELS } from '@/utils/constants';
import { useTimeRange } from '@/composables/useTimeRange';

const dashboard = useDashboardStore();
const stream = useStreamStore();
const theme = useThemeStore();
const { rangeOptions } = useTimeRange();

const datasetKeys: DatasetKey[] = ['cpu', 'memory', 'network', 'users', 'requests', 'errors'];
const datasetLabels = DATASET_LABELS;

const severityOptions = [
  { label: 'All Severities', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Warning', value: 'warning' },
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
];

const chartModeOptions = [
  { label: 'Smooth Charts', value: 'smooth' },
  { label: 'Stepped Charts', value: 'stepped' },
];

const search = ref(dashboard.filters.search);
const debouncedSearch = useDebounce(search, 180);

watch(debouncedSearch, (value) => {
  dashboard.setSearch(value);
});

const isPaused = computed(() => stream.status === 'paused');

const severityModel = computed({
  get: () => dashboard.filters.severity,
  set: (value: string) => dashboard.setSeverityFilter(value as SeverityLevel | 'all'),
});

const timeRangeModel = computed({
  get: () => dashboard.filters.timeRange,
  set: (value: string) => dashboard.setTimeRange(value as DashboardFilters['timeRange']),
});

const chartModeModel = computed({
  get: () => dashboard.chartMode,
  set: (value: string) => dashboard.setChartMode(value as ChartMode),
});

function toggleStreaming() {
  if (stream.status === 'paused') {
    streamService.resume();
    return;
  }

  streamService.pause();
}
</script>
