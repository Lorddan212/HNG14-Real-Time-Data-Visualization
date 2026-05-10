<template>
  <aside class="insight-panel">
    <header class="panel-header">
      <div>
        <p class="eyebrow">Insights</p>
        <h2>Operational signals</h2>
      </div>
    </header>

    <div class="insight-panel__section">
      <div class="insight-row">
        <span>Connection</span>
        <StatusBadge :status="stream.status" />
      </div>
      <div class="insight-row">
        <span>Warnings</span>
        <strong>{{ dashboard.warningEventCount }}</strong>
      </div>
      <div class="insight-row">
        <span>Rejected payloads</span>
        <strong>{{ stream.rejectedPayloads.length }}</strong>
      </div>
    </div>

    <div class="insight-panel__section">
      <h3>Regional activity</h3>
      <ul class="region-list">
        <li v-for="region in normalizedRegions" :key="region.region" class="region-list__item">
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
    </div>

    <div class="insight-panel__section">
      <h3>Latest stream hygiene</h3>
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
</script>
