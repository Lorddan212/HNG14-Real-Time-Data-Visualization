<template>
  <div class="app-shell" :class="{ 'app-shell--sidebar-collapsed': isSidebarCollapsed }">
    <Sidebar :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
    <div class="app-shell__main">
      <Topbar />
      <RouterView />
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppFooter from '@/components/layout/AppFooter.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Topbar from '@/components/layout/Topbar.vue';

const isSidebarCollapsed = ref(false);
const mobileNavigationQuery = '(max-width: 900px)';
let mobileNavigationMedia: MediaQueryList | null = null;

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

function syncNavigationMode(event: MediaQueryList | MediaQueryListEvent) {
  isSidebarCollapsed.value = event.matches;
}

onMounted(() => {
  mobileNavigationMedia = window.matchMedia(mobileNavigationQuery);
  syncNavigationMode(mobileNavigationMedia);
  mobileNavigationMedia.addEventListener('change', syncNavigationMode);
});

onBeforeUnmount(() => {
  mobileNavigationMedia?.removeEventListener('change', syncNavigationMode);
});
</script>
