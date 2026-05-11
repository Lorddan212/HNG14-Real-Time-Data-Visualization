<template>
  <aside class="sidebar" aria-label="Primary navigation">
    <RouterLink class="sidebar__brand" to="/" aria-label="Northstar Commerce operations home">
      <span class="sidebar__mark">NS</span>
      <span>
        <strong>NorthStar</strong>
        <small>Prod Control</small>
      </span>
    </RouterLink>

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
import { LayoutDashboard, Map, Server, ShieldAlert } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>
