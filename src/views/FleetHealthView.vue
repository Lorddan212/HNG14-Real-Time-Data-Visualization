<template>
  <main class="dashboard-view section-page">
    <section class="section-hero">
      <div>
        <p class="dashboard-header__kicker">Fleet Health</p>
        <h1>Production Fleet Posture</h1>
        <p class="dashboard-header__summary">
          Capacity, latency, service load, and platform resilience across Northstar Commerce runtime systems.
        </p>
      </div>
      <div class="section-hero__stats">
        <span>Services Tracked</span>
        <strong>{{ dashboard.services.length }}</strong>
      </div>
    </section>

    <ControlPanel />

    <section class="metric-grid" aria-label="Fleet health metrics">
      <MetricCard
        v-for="metric in metricCards.slice(0, 4)"
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

    <section class="analytics-grid analytics-grid--balanced" aria-label="Fleet analytics">
      <Card class="chart-panel">
        <HealthRadarChart :health="dashboard.health" :theme-mode="theme.mode" :loading="dashboard.isLoading" />
      </Card>
      <Card class="chart-panel">
        <LiveBarChart
          :services="dashboard.services"
          :visible="dashboard.visibleDatasets"
          :theme-mode="theme.mode"
          :loading="dashboard.isLoading"
        />
      </Card>
      <Card class="fleet-table-card">
        <header class="panel-header">
          <div>
            <p class="eyebrow">Service Inventory</p>
            <h2>Current Load By Service</h2>
          </div>
        </header>
        <div class="service-list">
          <div v-for="service in dashboard.services" :key="service.service" class="service-list__row">
            <strong>{{ service.service }}</strong>
            <span>{{ service.requests.toLocaleString('en-US') }} req/min</span>
            <span>{{ service.latency }} ms p95</span>
            <span :class="{ 'service-list__errors--hot': service.errors > 8 }">{{ service.errors }} errors</span>
          </div>
        </div>
      </Card>
    </section>
  </main>
</template>

<script setup lang="ts">
import ControlPanel from '@/components/dashboard/ControlPanel.vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';
import HealthRadarChart from '@/components/charts/HealthRadarChart.vue';
import LiveBarChart from '@/components/charts/LiveBarChart.vue';
import Card from '@/components/ui/Card.vue';
import { useLiveMetricCards } from '@/composables/useLiveMetricCards';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useThemeStore } from '@/stores/themeStore';

const dashboard = useDashboardStore();
const theme = useThemeStore();
const { metricCards } = useLiveMetricCards();
</script>
