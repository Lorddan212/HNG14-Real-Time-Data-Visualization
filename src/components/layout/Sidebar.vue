<template>
  <aside class="sidebar" aria-label="Primary navigation">
    <RouterLink class="sidebar__brand" to="/" aria-label="Operations dashboard home">
      <span class="sidebar__mark">OI</span>
      <span>
        <strong>OpsIntel</strong>
        <small>Command</small>
      </span>
    </RouterLink>

    <nav class="sidebar__nav">
      <RouterLink class="sidebar__link sidebar__link--active" to="/">
        <LayoutDashboard :size="18" aria-hidden="true" />
        <span>Overview</span>
      </RouterLink>
      <button class="sidebar__link" type="button">
        <Server :size="18" aria-hidden="true" />
        <span>Fleet Health</span>
      </button>
      <button class="sidebar__link" type="button">
        <ShieldAlert :size="18" aria-hidden="true" />
        <span>Incidents</span>
      </button>
      <button class="sidebar__link" type="button">
        <Map :size="18" aria-hidden="true" />
        <span>Regions</span>
      </button>
    </nav>

    <div class="sidebar__footer">
      <span class="sidebar__pulse" />
      <span>Live telemetry</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, Map, Server, ShieldAlert } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>
