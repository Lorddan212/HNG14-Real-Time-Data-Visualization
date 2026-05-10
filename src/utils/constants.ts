import type { DatasetKey, TimeRangeKey, VisibleDatasets } from '@/types/metrics';

export const STREAM_INTERVAL_MS = 1_000;
export const MAX_SERIES_POINTS = 3_600;
export const MAX_ACTIVITY_ITEMS = 500;
export const MAX_VISIBLE_TABLE_ROWS = 220;
export const MAX_REJECTED_PAYLOADS = 24;

export const TIME_RANGES: Record<TimeRangeKey, { label: string; value: number }> = {
  '1m': { label: 'Last 1 min', value: 60_000 },
  '5m': { label: 'Last 5 mins', value: 300_000 },
  '15m': { label: 'Last 15 mins', value: 900_000 },
  '1h': { label: 'Last 1 hour', value: 3_600_000 },
};

export const DEFAULT_VISIBLE_DATASETS: VisibleDatasets = {
  cpu: true,
  memory: true,
  network: true,
  users: true,
  requests: true,
  errors: true,
};

export const DATASET_LABELS: Record<DatasetKey, string> = {
  cpu: 'CPU',
  memory: 'Memory',
  network: 'Network',
  users: 'Users',
  requests: 'Requests',
  errors: 'Errors',
};

export const SERVICES = ['API Gateway', 'Auth', 'Billing', 'Telemetry', 'Search', 'Worker'];
export const REGIONS = ['US-East', 'US-West', 'EU-Central', 'AP-South', 'Africa-West'];
export const SOURCES = ['edge-node-04', 'kafka-stream', 'auth-cluster', 'siem-core', 'iot-bridge'];
