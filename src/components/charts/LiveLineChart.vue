<template>
  <div class="chart-shell">
    <header class="chart-shell__header">
      <div>
        <p class="eyebrow">Live Trend</p>
        <h2>CPU, Memory & Network</h2>
      </div>
      <span class="chart-shell__meta">{{ points.length }} pts</span>
    </header>

    <ErrorState v-if="error && points.length === 0" :message="error" />
    <LoadingState v-else-if="loading" />
    <EmptyState
      v-else-if="points.length === 0 || activeSeriesCount === 0"
      title="No trend data"
      message="Enable at least one dataset or wait for the stream to publish telemetry."
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
import ErrorState from '@/components/ui/ErrorState.vue';
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
  error?: string | null;
}>();

const activeSeriesCount = computed(() => {
  return [props.visible.cpu, props.visible.memory, props.visible.network].filter(Boolean).length;
});

const palette = computed(() => {
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

  if (props.visible.cpu) {
    series.push({
      name: 'CPU',
      type: 'line',
      smooth: !stepped,
      step: stepped ? 'middle' : false,
      symbol: 'none',
      showSymbol: false,
      lineStyle: { width: 2.6, color: '#2563eb' },
      itemStyle: { color: '#2563eb' },
      areaStyle: { color: 'rgba(37, 99, 235, 0.08)' },
      data: props.points.map((point) => [point.timestamp, point.cpu]),
    });
  }

  if (props.visible.memory) {
    series.push({
      name: 'Memory',
      type: 'line',
      smooth: !stepped,
      step: stepped ? 'middle' : false,
      symbol: 'none',
      showSymbol: false,
      lineStyle: { width: 2.4, color: '#7c3aed' },
      itemStyle: { color: '#7c3aed' },
      data: props.points.map((point) => [point.timestamp, point.memory]),
    });
  }

  if (props.visible.network) {
    series.push({
      name: 'Network',
      type: 'line',
      smooth: !stepped,
      step: stepped ? 'middle' : false,
      yAxisIndex: 1,
      symbol: 'none',
      showSymbol: false,
      lineStyle: { width: 2.4, color: '#06b6d4' },
      itemStyle: { color: '#06b6d4' },
      data: props.points.map((point) => [point.timestamp, point.networkIn + point.networkOut]),
    });
  }

  return {
    color: ['#2563eb', '#7c3aed', '#06b6d4'],
    animationDuration: 450,
    animationDurationUpdate: 360,
    animationEasingUpdate: 'cubicOut',
    grid: { left: 44, right: 48, top: 38, bottom: 34 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: palette.value.tooltip,
      borderColor: 'rgba(148, 163, 184, 0.18)',
      textStyle: { color: palette.value.text },
      valueFormatter: (value) => `${Number(value).toFixed(1)}`,
    },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: palette.value.muted },
      icon: 'roundRect',
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        color: palette.value.muted,
        formatter: (value: number) => formatTime(value),
      },
      axisLine: { lineStyle: { color: palette.value.grid } },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { color: palette.value.muted, formatter: '{value}%' },
        splitLine: { lineStyle: { color: palette.value.grid } },
      },
      {
        type: 'value',
        axisLabel: { color: palette.value.muted, formatter: '{value} Mbps' },
        splitLine: { show: false },
      },
    ],
    series,
  };
});
</script>
