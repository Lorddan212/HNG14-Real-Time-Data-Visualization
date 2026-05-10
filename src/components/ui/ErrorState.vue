<template>
  <div class="state state--error" role="alert">
    <p class="state__title">{{ title }}</p>
    <p class="state__body">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    message: string;
  }>(),
  {
    title: 'Stream notice',
  },
);
</script>
