<template>
  <aside class="insight-panel">
    <header class="panel-header">
      <div>
        <p class="eyebrow">Insights</p>
        <h2>SLO And Fleet Signals</h2>
      </div>
    </header>

    <div class="insight-panel__section">
      <div class="insight-row">
        <span>Connection</span>
        <StatusBadge :status="stream.status" />
      </div>
      <div class="insight-row">
        <span>Active Warnings</span>
        <strong>{{ dashboard.activeWarningCount }}</strong>
      </div>
      <div class="insight-row">
        <span>Rejected Payloads</span>
        <strong>{{ stream.rejectedPayloads.length }}</strong>
      </div>
    </div>

    <div class="insight-panel__section">
      <h3>Regional Activity</h3>
      <ul class="region-list">
        <li v-for="region in topRegions" :key="region.region" class="region-list__item">
          <div class="region-list__label">
            <span>{{ region.region }}</span>
            <strong>{{ formatCompact(region.activity) }}</strong>
          </div>
          <div class="region-list__bar" aria-hidden="true">
            <span :style="{ width: `${region.normalized}%` }" />
          </div>
          <small>{{ region.latency }} ms latency &middot; {{ region.errors }} errors</small>
        </li>
      </ul>
      <p v-if="remainingRegionCount > 0" class="insight-panel__muted">
        {{ remainingRegionCount }} additional regions reporting normally.
      </p>
    </div>

    <div class="insight-panel__section">
      <h3>Stream Validation</h3>
      <p v-if="stream.rejectedPayloads.length === 0" class="insight-panel__muted">
        All recent payloads passed validation.
      </p>
      <ul v-else class="hygiene-list">
        <li v-for="payload in stream.rejectedPayloads.slice(0, 3)" :key="payload.id">
          <span>{{ formatTime(payload.timestamp) }}</span>
          <strong>{{ payload.reason }}</strong>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatusBadge from '@/components/dashboard/StatusBadge.vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import { formatCompact, formatTime } from '@/utils/formatters';

const dashboard = useDashboardStore();
const stream = useStreamStore();

const normalizedRegions = computed(() => {
  const maxActivity = Math.max(...dashboard.regions.map((region) => region.activity), 1);

  return dashboard.regions.map((region) => ({
    ...region,
    normalized: Math.max(6, Math.round((region.activity / maxActivity) * 100)),
  }));
});

const topRegions = computed(() => {
  return [...normalizedRegions.value].sort((a, b) => b.activity - a.activity).slice(0, 8);
});

const remainingRegionCount = computed(() => Math.max(0, dashboard.regions.length - topRegions.value.length));
</script>
