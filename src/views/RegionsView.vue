<template>
  <main class="dashboard-view section-page">
    <section class="section-hero">
      <div>
        <p class="dashboard-header__kicker">Regions</p>
        <h1>Regional Traffic And Resilience</h1>
        <p class="dashboard-header__summary">
          Live customer activity, error pressure, and p95 latency across Northstar Commerce deployment regions.
        </p>
      </div>
      <div class="section-hero__stats">
        <span>Regions Online</span>
        <strong>{{ dashboard.regions.length }}</strong>
      </div>
    </section>

    <ControlPanel />

    <section class="region-grid" aria-label="Regional telemetry">
      <Card v-for="region in normalizedRegions" :key="region.region" class="region-card">
        <div class="region-card__top">
          <div>
            <p class="eyebrow">{{ region.region }}</p>
            <h2>{{ formatCompact(region.activity) }} active</h2>
          </div>
          <span :class="['region-card__status', region.errors > 10 ? 'region-card__status--hot' : '']">
            {{ region.errors > 10 ? 'Watch' : 'Healthy' }}
          </span>
        </div>
        <div class="region-card__bar" aria-hidden="true">
          <span :style="{ width: `${region.normalized}%` }" />
        </div>
        <div class="region-card__meta">
          <span>{{ region.latency }} ms p95</span>
          <span>{{ region.errors }} errors</span>
        </div>
      </Card>
    </section>

    <section class="analytics-grid analytics-grid--balanced" aria-label="Regional analytics">
      <Card class="chart-panel chart-panel--full">
        <LiveAreaChart
          :points="filteredMetrics"
          :visible="dashboard.visibleDatasets"
          :mode="dashboard.chartMode"
          :theme-mode="theme.mode"
          :loading="dashboard.isLoading"
        />
      </Card>
      <InsightPanel />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InsightPanel from '@/components/dashboard/InsightPanel.vue';
import ControlPanel from '@/components/dashboard/ControlPanel.vue';
import LiveAreaChart from '@/components/charts/LiveAreaChart.vue';
import Card from '@/components/ui/Card.vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useThemeStore } from '@/stores/themeStore';
import { formatCompact } from '@/utils/formatters';

const dashboard = useDashboardStore();
const theme = useThemeStore();
const filteredMetrics = computed(() => dashboard.filteredMetrics);

const normalizedRegions = computed(() => {
  const maxActivity = Math.max(...dashboard.regions.map((region) => region.activity), 1);

  return dashboard.regions.map((region) => ({
    ...region,
    normalized: Math.max(8, Math.round((region.activity / maxActivity) * 100)),
  }));
});
</script>
