<template>
  <main class="dashboard-view">
    <DashboardHeader />
    <ControlPanel />

    <ErrorState
      v-if="dashboard.error && stream.status !== 'connected'"
      class="stream-alert"
      :message="dashboard.error"
    />

    <section class="metric-grid" aria-label="Live metrics">
      <MetricCard
        v-for="metric in metricCards"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :trend="metric.trend"
        :points="metric.points"
        :format="metric.format"
        :tone="metric.tone"
        :icon="metric.icon"
      />
    </section>

    <section class="analytics-grid" aria-label="Live analytics charts">
      <Card class="chart-panel chart-panel--wide">
        <LiveLineChart
          :points="filteredMetrics"
          :visible="dashboard.visibleDatasets"
          :mode="dashboard.chartMode"
          :theme-mode="theme.mode"
          :loading="dashboard.isLoading"
          :error="dashboard.error"
        />
      </Card>

      <Card class="chart-panel">
        <LiveBarChart
          :services="dashboard.services"
          :visible="dashboard.visibleDatasets"
          :theme-mode="theme.mode"
          :loading="dashboard.isLoading"
        />
      </Card>

      <Card class="chart-panel chart-panel--wide">
        <LiveAreaChart
          :points="filteredMetrics"
          :visible="dashboard.visibleDatasets"
          :mode="dashboard.chartMode"
          :theme-mode="theme.mode"
          :loading="dashboard.isLoading"
        />
      </Card>

      <Card class="chart-panel">
        <HealthRadarChart :health="dashboard.health" :theme-mode="theme.mode" :loading="dashboard.isLoading" />
      </Card>

      <InsightPanel />
    </section>

    <ActivityFeed />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Activity, AlertTriangle, Cpu, HardDrive, RadioTower, Timer, Users } from 'lucide-vue-next';
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue';
import ControlPanel from '@/components/dashboard/ControlPanel.vue';
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import InsightPanel from '@/components/dashboard/InsightPanel.vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';
import HealthRadarChart from '@/components/charts/HealthRadarChart.vue';
import LiveAreaChart from '@/components/charts/LiveAreaChart.vue';
import LiveBarChart from '@/components/charts/LiveBarChart.vue';
import LiveLineChart from '@/components/charts/LiveLineChart.vue';
import Card from '@/components/ui/Card.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import { useStreaming } from '@/composables/useStreaming';
import { useTheme } from '@/composables/useTheme';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import type { MetricSnapshot } from '@/types/metrics';

useStreaming();
const theme = useTheme();
const dashboard = useDashboardStore();
const stream = useStreamStore();

const filteredMetrics = computed(() => dashboard.filteredMetrics);
const latest = computed(() => dashboard.latestMetric);
const previous = computed(() => dashboard.previousMetric);

function readMetric(point: MetricSnapshot | null, key: keyof MetricSnapshot): number {
  const value = point?.[key];
  return typeof value === 'number' ? value : 0;
}

function trendFor(key: keyof MetricSnapshot): number {
  const current = readMetric(latest.value, key);
  const before = readMetric(previous.value, key);

  if (!before) {
    return 0;
  }

  return ((current - before) / before) * 100;
}

const metricCards = computed(() => [
  {
    title: 'CPU usage',
    value: readMetric(latest.value, 'cpu'),
    trend: trendFor('cpu'),
    points: filteredMetrics.value.map((point) => point.cpu),
    format: 'percent' as const,
    tone: 'blue' as const,
    icon: Cpu,
  },
  {
    title: 'Memory load',
    value: readMetric(latest.value, 'memory'),
    trend: trendFor('memory'),
    points: filteredMetrics.value.map((point) => point.memory),
    format: 'percent' as const,
    tone: 'violet' as const,
    icon: HardDrive,
  },
  {
    title: 'Network traffic',
    value: (latest.value?.networkIn ?? 0) + (latest.value?.networkOut ?? 0),
    trend: trendFor('networkIn'),
    points: filteredMetrics.value.map((point) => point.networkIn + point.networkOut),
    format: 'mbps' as const,
    tone: 'cyan' as const,
    icon: RadioTower,
  },
  {
    title: 'Active users',
    value: readMetric(latest.value, 'activeUsers'),
    trend: trendFor('activeUsers'),
    points: filteredMetrics.value.map((point) => point.activeUsers),
    format: 'compact' as const,
    tone: 'emerald' as const,
    icon: Users,
  },
  {
    title: 'Request rate',
    value: readMetric(latest.value, 'requestRate'),
    trend: trendFor('requestRate'),
    points: filteredMetrics.value.map((point) => point.requestRate),
    format: 'compact' as const,
    tone: 'amber' as const,
    icon: Activity,
  },
  {
    title: 'Error rate',
    value: readMetric(latest.value, 'errorRate'),
    trend: trendFor('errorRate'),
    points: filteredMetrics.value.map((point) => point.errorRate),
    format: 'percent' as const,
    tone: 'red' as const,
    icon: AlertTriangle,
  },
  {
    title: 'Latency',
    value: readMetric(latest.value, 'latency'),
    trend: trendFor('latency'),
    points: filteredMetrics.value.map((point) => point.latency),
    format: 'ms' as const,
    tone: 'blue' as const,
    icon: Timer,
  },
]);
</script>
