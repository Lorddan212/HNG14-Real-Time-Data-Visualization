<template>
  <header class="dashboard-header">
    <div>
      <p class="dashboard-header__kicker">Real-Time Operations Intelligence</p>
      <h1>Live systems command center</h1>
      <p class="dashboard-header__summary">
        Streaming infrastructure, security, product demand, and regional health in one operational view.
      </p>
    </div>

    <div class="dashboard-header__stats">
      <div>
        <span>Last heartbeat</span>
        <strong>{{ formatRelativeTime(stream.lastHeartbeat) }}</strong>
      </div>
      <div>
        <span>Critical alerts</span>
        <strong>{{ dashboard.criticalEventCount }}</strong>
      </div>
      <div>
        <span>Rejected payloads</span>
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
