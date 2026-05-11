<template>
  <div class="chart-shell">
    <header class="chart-shell__header">
      <div>
        <p class="eyebrow">Demand</p>
        <h2>Users, Requests & Errors</h2>
      </div>
      <span class="chart-shell__meta">area</span>
    </header>

    <LoadingState v-if="loading" />
    <EmptyState
      v-else-if="points.length === 0 || activeSeriesCount === 0"
      title="No demand data"
      message="Resume streaming or enable users, requests, or errors."
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
import type { ChartMode, MetricSnapshot, VisibleDatasets } from '@/types/metrics';
import { formatTime } from '@/utils/formatters';

const props = defineProps<{
  points: MetricSnapshot[];
  visible: VisibleDatasets;
  mode: ChartMode;
  themeMode: 'light' | 'dark';
  loading: boolean;
}>();

const activeSeriesCount = computed(() => {
  return [props.visible.users, props.visible.requests, props.visible.errors].filter(Boolean).length;
});

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
  const stepped = props.mode === 'stepped';
  const series: EChartsOption['series'] = [];

  if (props.visible.users) {
    series.push({
      name: 'Active users',
      type: 'line',
      smooth: !stepped,
      step: stepped ? 'end' : false,
      symbol: 'none',
      showSymbol: false,
      lineStyle: { width: 2.4, color: '#10b981' },
      itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16, 185, 129, 0.18)' },
      data: props.points.map((point) => [point.timestamp, point.activeUsers]),
    });
  }

  if (props.visible.requests) {
    series.push({
      name: 'Request rate',
      type: 'line',
      smooth: !stepped,
      step: stepped ? 'end' : false,
      yAxisIndex: 1,
      symbol: 'none',
      showSymbol: false,
      lineStyle: { width: 2.2, color: '#0ea5e9' },
      itemStyle: { color: '#0ea5e9' },
      areaStyle: { color: 'rgba(14, 165, 233, 0.14)' },
      data: props.points.map((point) => [point.timestamp, point.requestRate]),
    });
  }

  if (props.visible.errors) {
    series.push({
      name: 'Error rate',
      type: 'line',
      smooth: !stepped,
      step: stepped ? 'end' : false,
      yAxisIndex: 1,
      symbol: 'none',
      showSymbol: false,
      lineStyle: { width: 2.2, color: '#ef4444' },
      itemStyle: { color: '#ef4444' },
      areaStyle: { color: 'rgba(239, 68, 68, 0.1)' },
      data: props.points.map((point) => [point.timestamp, point.errorRate * 180]),
    });
  }

  return {
    animationDuration: 450,
    animationDurationUpdate: 360,
    animationEasingUpdate: 'cubicOut',
    grid: { left: 48, right: 48, top: 38, bottom: 34 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.value.tooltip,
      borderColor: 'rgba(148, 163, 184, 0.18)',
      textStyle: { color: colors.value.text },
      valueFormatter: (value) => `${Number(value).toFixed(1)}`,
    },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: colors.value.muted },
      icon: 'roundRect',
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        color: colors.value.muted,
        formatter: (value: number) => formatTime(value),
      },
      axisLine: { lineStyle: { color: colors.value.grid } },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: { color: colors.value.muted },
        splitLine: { lineStyle: { color: colors.value.grid } },
      },
      {
        type: 'value',
        axisLabel: { color: colors.value.muted },
        splitLine: { show: false },
      },
    ],
    series,
  };
});
</script>
