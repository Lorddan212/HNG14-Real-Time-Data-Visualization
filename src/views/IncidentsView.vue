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

    <section class="incident-workbench" aria-label="Incident runbook workbench">
      <Card class="incident-queue">
        <header class="panel-header">
          <div>
            <p class="eyebrow">Runbook Queue</p>
            <h2>Actionable alerts</h2>
          </div>
          <span class="panel-header__count">{{ actionableEvents.length }} open</span>
        </header>

        <div v-if="actionableEvents.length === 0" class="incident-empty">
          No active warning or critical events in the selected time window.
        </div>
        <div v-else class="incident-list">
          <button
            v-for="event in actionableEvents"
            :key="event.id"
            class="incident-list__item"
            type="button"
            :class="{ 'incident-list__item--selected': event.id === runbookEvent?.id }"
            @click="dashboard.selectRunbook(event.id)"
          >
            <span class="severity-pill" :class="`severity-pill--${event.severity}`">{{ event.severity }}</span>
            <strong>{{ event.title }}</strong>
            <small>{{ event.service }} / {{ event.region }} / {{ formatTime(event.timestamp) }}</small>
          </button>
        </div>
      </Card>

      <Card class="runbook-card">
        <header class="panel-header">
          <div>
            <p class="eyebrow">Runbook</p>
            <h2>{{ runbookEvent ? runbookTitle : 'No active runbook' }}</h2>
          </div>
        </header>

        <div v-if="runbookEvent" class="runbook-card__body">
          <p>{{ runbookEvent.message }}</p>
          <ol>
            <li>Confirm customer impact and compare against the selected time window.</li>
            <li>Inspect {{ runbookEvent.service }} in {{ runbookEvent.region }} and verify recent deploys.</li>
            <li>Check upstream dependency health, retries, and saturation signals.</li>
            <li>Acknowledge the alert after ownership and next action are clear.</li>
          </ol>
          <button class="activity-action activity-action--primary" type="button" @click="dashboard.acknowledgeEvent(runbookEvent.id)">
            {{ dashboard.acknowledgedEventIds.includes(runbookEvent.id) ? 'Acknowledged' : 'Acknowledge incident' }}
          </button>
        </div>

        <p v-else class="incident-empty">Select an actionable alert to view the response guide.</p>
      </Card>
    </section>

    <ActivityFeed />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue';
import ControlPanel from '@/components/dashboard/ControlPanel.vue';
import Card from '@/components/ui/Card.vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import { formatTime } from '@/utils/formatters';

const dashboard = useDashboardStore();
const stream = useStreamStore();

const actionableEvents = computed(() => {
  return dashboard.filteredEvents
    .filter(
      (event) =>
        (event.severity === 'critical' || event.severity === 'warning') &&
        !dashboard.acknowledgedEventIds.includes(event.id),
    )
    .slice(0, 6);
});

const runbookEvent = computed(() => dashboard.selectedRunbookEvent ?? actionableEvents.value[0] ?? null);
const runbookTitle = computed(() => (runbookEvent.value ? `${runbookEvent.value.service} response guide` : 'No active runbook'));
</script>
