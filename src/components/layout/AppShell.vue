<template>
  <div class="app-shell">
    <Sidebar />
    <div class="app-shell__main">
      <Topbar />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from '@/components/layout/Sidebar.vue';
import Topbar from '@/components/layout/Topbar.vue';
</script>
