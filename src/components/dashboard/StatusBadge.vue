<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    <span class="status-badge__dot" />
    {{ statusLabel(status) }}
  </span>
</template>

<script setup lang="ts">
import type { ConnectionStatus } from '@/types/metrics';
import { statusLabel } from '@/utils/formatters';

defineProps<{
  status: ConnectionStatus;
}>();
</script>
