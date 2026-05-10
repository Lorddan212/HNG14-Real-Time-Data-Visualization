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

export const SERVICES = [
  'edge-api',
  'identity-service',
  'checkout-api',
  'payments-ledger',
  'telemetry-ingest',
  'search-indexer',
  'event-worker',
  'fraud-scoring',
];

export const REGIONS = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-south-1', 'af-south-1'];

export const SOURCES = [
  'eks-prod-a/ip-10-42-18-91',
  'eks-prod-b/ip-10-53-07-44',
  'edge-pop-lhr-02',
  'edge-pop-iad-07',
  'kafka-stream/orders.v3',
  'redis-cluster-cache-02',
  'aurora-reader-prod-01',
  'waf-managed-ruleset',
];
