<template>
  <div class="state state--empty">
    <p class="state__title">{{ title }}</p>
    <p class="state__body">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    message?: string;
  }>(),
  {
    title: 'No Matching Data',
    message: 'Adjust filters or resume the stream to populate this view.',
  },
);
</script>
