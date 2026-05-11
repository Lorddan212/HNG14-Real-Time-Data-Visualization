<template>
  <header class="dashboard-header">
    <div>
      <p class="dashboard-header__kicker">Real-Time Operations Intelligence</p>
      <h1>Production Control Plane</h1>
      <p class="dashboard-header__summary">
        Live telemetry for checkout traffic, edge capacity, identity, payments, and security signals across the production fleet.
      </p>
    </div>

    <div class="dashboard-header__stats">
      <div>
        <span>Last Heartbeat</span>
        <strong class="heartbeat-value">{{ formatRelativeTime(stream.lastHeartbeat) }}</strong>
      </div>
      <div>
        <span>Active Criticals</span>
        <strong>{{ dashboard.activeCriticalCount }}</strong>
      </div>
      <div>
        <span>Rejected Payloads</span>
        <strong>{{ stream.rejectedPayloads.length }}</strong>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import { formatRelativeTime } from '@/utils/formatters';

const dashboard = useDashboardStore();
const stream = useStreamStore();
</script>
