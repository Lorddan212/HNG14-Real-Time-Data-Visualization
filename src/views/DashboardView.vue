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
import { useLiveMetricCards } from '@/composables/useLiveMetricCards';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import { useThemeStore } from '@/stores/themeStore';

const theme = useThemeStore();
const dashboard = useDashboardStore();
const stream = useStreamStore();
const { filteredMetrics, metricCards } = useLiveMetricCards();
</script>
