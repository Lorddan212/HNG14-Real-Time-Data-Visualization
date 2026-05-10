<template>
  <div class="state state--loading" role="status" aria-live="polite">
    <span class="state__spinner" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: 'Waiting for live telemetry...',
  },
);
</script>
