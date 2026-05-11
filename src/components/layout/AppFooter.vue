<template>
  <footer class="app-footer" aria-label="Production operations metadata">
    <div class="app-footer__brand">
      <strong>NorthStar Commerce Production Control</strong>
      <span>Live Telemetry Simulated For Operational Intelligence</span>
    </div>

    <div class="app-footer__meta">
      <span>Environment: Production</span>
      <span>Version: v1.0.0</span>
      <span>Heartbeat: {{ formatRelativeTime(stream.lastHeartbeat) }}</span>
      <StatusBadge :status="stream.status" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/dashboard/StatusBadge.vue';
import { useStreamStore } from '@/stores/streamStore';
import { formatRelativeTime } from '@/utils/formatters';

const stream = useStreamStore();
</script>
