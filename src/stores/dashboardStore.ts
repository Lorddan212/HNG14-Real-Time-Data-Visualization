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

      return state.events.filter((event) => {
        const severityMatches = state.filters.severity === 'all' || event.severity === state.filters.severity;
        const searchMatches =
          query.length === 0 ||
          event.title.toLowerCase().includes(query) ||
          event.message.toLowerCase().includes(query) ||
          event.service.toLowerCase().includes(query) ||
          event.region.toLowerCase().includes(query) ||
          event.source.toLowerCase().includes(query);

        return severityMatches && searchMatches;
      });
    },
    criticalEventCount: (state) => state.events.filter((event) => event.severity === 'critical').length,
    warningEventCount: (state) => state.events.filter((event) => event.severity === 'warning').length,
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
    },
    setError(message: string | null) {
      this.error = message;
      this.isLoading = false;
    },
    clearEvents() {
      this.events = [];
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
  },
});
