<template>
  <section class="ui-card" :class="[`ui-card--${tone}`]">
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'default' | 'accent' | 'danger';
  }>(),
  {
    tone: 'default',
  },
);
</script>
