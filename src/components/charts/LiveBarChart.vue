<template>
  <div class="chart-shell">
    <header class="chart-shell__header">
      <div>
        <p class="eyebrow">Distribution</p>
        <h2>Service traffic</h2>
      </div>
      <span class="chart-shell__meta">{{ services.length }} svc</span>
    </header>

    <LoadingState v-if="loading" />
    <EmptyState
      v-else-if="services.length === 0 || activeSeriesCount === 0"
      title="No service data"
      message="Request and error datasets are currently disabled."
    />
    <VChart
      v-else
      class="chart"
      :option="option"
      autoresize
      :update-options="{ notMerge: false, lazyUpdate: true }"
    />
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { computed } from 'vue';
import VChart from 'vue-echarts';
import EmptyState from '@/components/ui/EmptyState.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import type { ServiceLoad, VisibleDatasets } from '@/types/metrics';

const props = defineProps<{
  services: ServiceLoad[];
  visible: VisibleDatasets;
  themeMode: 'light' | 'dark';
  loading: boolean;
}>();

const activeSeriesCount = computed(() => [props.visible.requests, props.visible.errors].filter(Boolean).length);

const colors = computed(() => {
  const dark = props.themeMode === 'dark';
  return {
    text: dark ? '#cbd5e1' : '#334155',
    muted: dark ? '#94a3b8' : '#64748b',
    grid: dark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(71, 85, 105, 0.12)',
    tooltip: dark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)',
  };
});

const option = computed<EChartsOption>(() => {
  const series: EChartsOption['series'] = [];

  if (props.visible.requests) {
    series.push({
      name: 'Requests',
      type: 'bar',
      barMaxWidth: 24,
      itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] },
      data: props.services.map((service) => service.requests),
    });
  }

  if (props.visible.errors) {
    series.push({
      name: 'Errors',
      type: 'bar',
      barMaxWidth: 24,
      itemStyle: { color: '#f97316', borderRadius: [4, 4, 0, 0] },
      data: props.services.map((service) => service.errors),
    });
  }

  return {
    animationDurationUpdate: 360,
    animationEasingUpdate: 'cubicOut',
    grid: { left: 42, right: 14, top: 38, bottom: 52 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.value.tooltip,
      borderColor: 'rgba(148, 163, 184, 0.18)',
      textStyle: { color: colors.value.text },
    },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: colors.value.muted },
      icon: 'roundRect',
    },
    xAxis: {
      type: 'category',
      data: props.services.map((service) => service.service),
      axisLabel: { color: colors.value.muted, interval: 0, rotate: 24 },
      axisLine: { lineStyle: { color: colors.value.grid } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: colors.value.muted },
      splitLine: { lineStyle: { color: colors.value.grid } },
    },
    series,
  };
});
</script>
