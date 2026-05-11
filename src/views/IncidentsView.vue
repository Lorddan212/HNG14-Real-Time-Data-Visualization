<template>
  <main class="dashboard-view section-page">
    <section class="section-hero">
      <div>
        <p class="dashboard-header__kicker">Incidents</p>
        <h1>Active Incident Command</h1>
        <p class="dashboard-header__summary">
          Time-windowed alerts, runbook triggers, rejected payloads, and security or availability anomalies.
        </p>
      </div>
      <div class="section-hero__stats section-hero__stats--danger">
        <span>Active Criticals</span>
        <strong>{{ dashboard.activeCriticalCount }}</strong>
      </div>
    </section>

    <ControlPanel />

    <section class="incident-grid" aria-label="Incident summary">
      <Card>
        <div class="incident-stat">
          <span>Critical Alerts In Window</span>
          <strong>{{ dashboard.activeCriticalCount }}</strong>
        </div>
      </Card>
      <Card>
        <div class="incident-stat">
          <span>Warnings In Window</span>
          <strong>{{ dashboard.activeWarningCount }}</strong>
        </div>
      </Card>
      <Card>
        <div class="incident-stat">
          <span>Rejected Stream Payloads</span>
          <strong>{{ stream.rejectedPayloads.length }}</strong>
        </div>
      </Card>
    </section>

    <ActivityFeed />
  </main>
</template>

<script setup lang="ts">
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue';
import ControlPanel from '@/components/dashboard/ControlPanel.vue';
import Card from '@/components/ui/Card.vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';

const dashboard = useDashboardStore();
const stream = useStreamStore();
</script>
