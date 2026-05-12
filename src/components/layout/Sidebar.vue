<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }" aria-label="Primary navigation">
    <div class="sidebar__brand-row">
      <RouterLink class="sidebar__brand" to="/" aria-label="Northstar Commerce operations home">
        <span class="sidebar__mark">NS</span>
        <span class="sidebar__brand-text">
          <strong>NorthStar</strong>
          <small>Prod Control</small>
        </span>
      </RouterLink>

      <button
        class="sidebar__collapse"
        type="button"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!collapsed"
        @click="$emit('toggle')"
      >
        <ChevronRight v-if="collapsed" class="sidebar__desktop-icon" :size="18" aria-hidden="true" />
        <ChevronLeft v-else class="sidebar__desktop-icon" :size="18" aria-hidden="true" />
        <Menu v-if="collapsed" class="sidebar__mobile-icon" :size="18" aria-hidden="true" />
        <X v-else class="sidebar__mobile-icon" :size="18" aria-hidden="true" />
      </button>
    </div>

    <nav class="sidebar__nav">
      <RouterLink class="sidebar__link" to="/">
        <LayoutDashboard :size="18" aria-hidden="true" />
        <span>Overview</span>
      </RouterLink>
      <RouterLink class="sidebar__link" to="/fleet">
        <Server :size="18" aria-hidden="true" />
        <span>Fleet Health</span>
      </RouterLink>
      <RouterLink class="sidebar__link" to="/incidents">
        <ShieldAlert :size="18" aria-hidden="true" />
        <span>Incidents</span>
      </RouterLink>
      <RouterLink class="sidebar__link" to="/regions">
        <Map :size="18" aria-hidden="true" />
        <span>Regions</span>
      </RouterLink>
    </nav>

    <div class="sidebar__footer">
      <span class="sidebar__pulse" />
      <span>Live Telemetry</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, LayoutDashboard, Map, Menu, Server, ShieldAlert, X } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

defineProps<{
  collapsed: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>
