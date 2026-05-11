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

export const REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'ca-west-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-north-1',
  'eu-south-1',
  'ap-south-1',
  'ap-south-2',
  'ap-east-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-southeast-3',
  'ap-northeast-1',
  'ap-northeast-2',
  'sa-east-1',
  'af-south-1',
  'me-south-1',
  'me-central-1',
  'il-central-1',
];

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
