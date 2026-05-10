<template>
  <header class="topbar">
    <div>
      <span class="topbar__label">Operations Intelligence</span>
      <strong>Real-time analytics workspace</strong>
    </div>

    <div class="topbar__actions">
      <span class="topbar__heartbeat">Heartbeat {{ formatRelativeTime(stream.lastHeartbeat) }}</span>
      <StatusBadge :status="stream.status" />
    </div>
  </header>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/dashboard/StatusBadge.vue';
import { useStreamStore } from '@/stores/streamStore';
import { formatRelativeTime } from '@/utils/formatters';

const stream = useStreamStore();
</script>
