<template>
  <section class="activity-feed">
    <header class="panel-header">
      <div>
        <p class="eyebrow">Activity Feed</p>
        <h2>Production events and alerts</h2>
      </div>
      <span class="panel-header__count">{{ rows.length }} visible</span>
    </header>

    <EmptyState
      v-if="rows.length === 0"
      title="No events match this view"
      message="Try another severity, clear search, or wait for a new stream event."
    />

    <div v-else class="activity-feed__table-wrap">
      <table class="activity-table">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.original.id" class="activity-table__row">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" :data-column="cell.column.id">
              <span
                v-if="cell.column.id === 'severity'"
                class="severity-pill"
                :class="`severity-pill--${row.original.severity}`"
              >
                {{ row.original.severity }}
              </span>
              <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table';
import EmptyState from '@/components/ui/EmptyState.vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { StreamEvent } from '@/types/events';
import { MAX_VISIBLE_TABLE_ROWS } from '@/utils/constants';
import { formatNumber, formatTime } from '@/utils/formatters';

const dashboard = useDashboardStore();
const columnHelper = createColumnHelper<StreamEvent>();

const rows = computed(() => dashboard.filteredEvents.slice(0, MAX_VISIBLE_TABLE_ROWS));

const columns = [
  columnHelper.accessor('timestamp', {
    id: 'time',
    header: 'Time',
    cell: (info) => formatTime(info.getValue()),
  }),
  columnHelper.accessor('severity', {
    header: 'Severity',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('title', {
    header: 'Event',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('service', {
    header: 'Service',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('region', {
    header: 'Region',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    cell: (info) => {
      const value = info.getValue();
      return typeof value === 'number' ? formatNumber(value) : '-';
    },
  }),
  columnHelper.accessor('source', {
    header: 'Source',
    cell: (info) => info.getValue(),
  }),
];

const table = useVueTable({
  get data() {
    return rows.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
});
</script>
