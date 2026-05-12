import { defineStore } from 'pinia';
import type { SeverityLevel } from '@/types/events';
import type {
  ChartMode,
  DashboardFilters,
  DatasetKey,
  HealthCategory,
  MetricSnapshot,
  RegionActivity,
  ServiceLoad,
  StreamPayload,
  VisibleDatasets,
} from '@/types/metrics';
import {
  DEFAULT_VISIBLE_DATASETS,
  MAX_ACTIVITY_ITEMS,
  MAX_SERIES_POINTS,
  TIME_RANGES,
} from '@/utils/constants';
import { appendLimited, prependLimited } from '@/utils/performance';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    metrics: [] as MetricSnapshot[],
    services: [] as ServiceLoad[],
    health: [] as HealthCategory[],
    regions: [] as RegionActivity[],
    events: [] as import('@/types/events').StreamEvent[],
    filters: {
      severity: 'all',
      search: '',
      timeRange: '5m',
    } as DashboardFilters,
    visibleDatasets: { ...DEFAULT_VISIBLE_DATASETS } as VisibleDatasets,
    chartMode: 'smooth' as ChartMode,
    acknowledgedEventIds: [] as string[],
    selectedRunbookEventId: null as string | null,
    isLoading: true,
    error: null as string | null,
    lastUpdated: null as number | null,
  }),
  getters: {
    latestMetric: (state) => state.metrics[state.metrics.length - 1] ?? null,
    previousMetric: (state) => state.metrics[state.metrics.length - 2] ?? null,
    filteredMetrics: (state) => {
      const cutoff = Date.now() - TIME_RANGES[state.filters.timeRange].value;
      return state.metrics.filter((point) => point.timestamp >= cutoff);
    },
    filteredEvents: (state) => {
      const query = state.filters.search.trim().toLowerCase();
      const cutoff = Date.now() - TIME_RANGES[state.filters.timeRange].value;

      return state.events.filter((event) => {
        const timeMatches = event.timestamp >= cutoff;
        const severityMatches = state.filters.severity === 'all' || event.severity === state.filters.severity;
        const searchMatches =
          query.length === 0 ||
          event.title.toLowerCase().includes(query) ||
          event.message.toLowerCase().includes(query) ||
          event.service.toLowerCase().includes(query) ||
          event.region.toLowerCase().includes(query) ||
          event.source.toLowerCase().includes(query);

        return timeMatches && severityMatches && searchMatches;
      });
    },
    activeCriticalCount: (state) => {
      const cutoff = Date.now() - TIME_RANGES[state.filters.timeRange].value;
      return state.events.filter(
        (event) =>
          event.timestamp >= cutoff &&
          event.severity === 'critical' &&
          !state.acknowledgedEventIds.includes(event.id),
      ).length;
    },
    activeWarningCount: (state) => {
      const cutoff = Date.now() - TIME_RANGES[state.filters.timeRange].value;
      return state.events.filter(
        (event) =>
          event.timestamp >= cutoff &&
          event.severity === 'warning' &&
          !state.acknowledgedEventIds.includes(event.id),
      ).length;
    },
    selectedRunbookEvent: (state) => {
      if (!state.selectedRunbookEventId) {
        return null;
      }

      return state.events.find((event) => event.id === state.selectedRunbookEventId) ?? null;
    },
  },
  actions: {
    ingest(payload: StreamPayload) {
      this.metrics = appendLimited(this.metrics, payload.metrics, MAX_SERIES_POINTS);
      this.events = prependLimited(this.events, payload.event, MAX_ACTIVITY_ITEMS);
      this.services = payload.services;
      this.health = payload.health;
      this.regions = payload.regions;
      this.lastUpdated = payload.timestamp;
      this.isLoading = false;
      this.error = null;
      const retainedEventIds = new Set(this.events.map((event) => event.id));
      this.acknowledgedEventIds = this.acknowledgedEventIds.filter((id) => retainedEventIds.has(id));
    },
    setError(message: string | null) {
      this.error = message;
      this.isLoading = false;
    },
    clearEvents() {
      this.events = [];
      this.acknowledgedEventIds = [];
      this.selectedRunbookEventId = null;
    },
    setSeverityFilter(severity: SeverityLevel | 'all') {
      this.filters.severity = severity;
    },
    setSearch(search: string) {
      this.filters.search = search;
    },
    setTimeRange(timeRange: DashboardFilters['timeRange']) {
      this.filters.timeRange = timeRange;
    },
    setChartMode(mode: ChartMode) {
      this.chartMode = mode;
    },
    toggleDataset(dataset: DatasetKey) {
      this.visibleDatasets[dataset] = !this.visibleDatasets[dataset];
    },
    acknowledgeEvent(eventId: string) {
      if (!this.acknowledgedEventIds.includes(eventId)) {
        this.acknowledgedEventIds = [...this.acknowledgedEventIds, eventId];
      }

      if (this.selectedRunbookEventId === eventId) {
        this.selectedRunbookEventId = null;
      }
    },
    selectRunbook(eventId: string) {
      this.selectedRunbookEventId = eventId;
    },
  },
});
