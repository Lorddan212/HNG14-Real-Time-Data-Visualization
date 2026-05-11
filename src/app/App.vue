<template>
  <AppShell />
</template>

<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue';
import { useStreaming } from '@/composables/useStreaming';
import { useTheme } from '@/composables/useTheme';

useStreaming();
useTheme();
</script>
