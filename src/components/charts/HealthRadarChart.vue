<template>
  <div class="chart-shell">
    <header class="chart-shell__header">
      <div>
        <p class="eyebrow">Resilience</p>
        <h2>System Health</h2>
      </div>
      <span class="chart-shell__meta">{{ averageScore }}%</span>
    </header>

    <LoadingState v-if="loading" />
    <EmptyState
      v-else-if="health.length === 0"
      title="No health model"
      message="Health categories will appear after the next valid payload."
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
import type { HealthCategory } from '@/types/metrics';

const props = defineProps<{
  health: HealthCategory[];
  themeMode: 'light' | 'dark';
  loading: boolean;
}>();

const colors = computed(() => {
  const dark = props.themeMode === 'dark';
  return {
    text: dark ? '#cbd5e1' : '#334155',
    muted: dark ? '#94a3b8' : '#64748b',
    split: dark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(71, 85, 105, 0.16)',
    tooltip: dark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)',
  };
});

const averageScore = computed(() => {
  if (!props.health.length) {
    return 0;
  }

  return Math.round(props.health.reduce((sum, category) => sum + category.score, 0) / props.health.length);
});

const option = computed<EChartsOption>(() => ({
  animationDurationUpdate: 360,
  tooltip: {
    backgroundColor: colors.value.tooltip,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    textStyle: { color: colors.value.text },
  },
  radar: {
    radius: '66%',
    center: ['50%', '56%'],
    indicator: props.health.map((category) => ({
      name: category.name,
      max: 100,
    })),
    axisName: { color: colors.value.muted, fontSize: 11 },
    splitLine: { lineStyle: { color: colors.value.split } },
    splitArea: {
      areaStyle: {
        color: ['rgba(37, 99, 235, 0.05)', 'rgba(16, 185, 129, 0.05)'],
      },
    },
    axisLine: { lineStyle: { color: colors.value.split } },
  },
  series: [
    {
      name: 'Health score',
      type: 'radar',
      data: [
        {
          value: props.health.map((category) => category.score),
          name: 'Health',
          areaStyle: { color: 'rgba(37, 99, 235, 0.22)' },
          lineStyle: { color: '#2563eb', width: 2.6 },
          itemStyle: { color: '#10b981' },
        },
      ],
    },
  ],
}));
</script>
