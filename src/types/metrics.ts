import type { StreamEvent } from './events';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'offline' | 'paused';
export type TimeRangeKey = '1m' | '5m' | '15m' | '1h';
export type ChartMode = 'smooth' | 'stepped';
export type DatasetKey = 'cpu' | 'memory' | 'network' | 'users' | 'requests' | 'errors';

export interface VisibleDatasets {
  cpu: boolean;
  memory: boolean;
  network: boolean;
  users: boolean;
  requests: boolean;
  errors: boolean;
}

export interface MetricSnapshot {
  id: string;
  timestamp: number;
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
  activeUsers: number;
  requestRate: number;
  errorRate: number;
  latency: number;
  throughput: number;
}

export interface ServiceLoad {
  service: string;
  requests: number;
  errors: number;
  latency: number;
}

export interface HealthCategory {
  name: string;
  score: number;
}

export interface RegionActivity {
  region: string;
  activity: number;
  errors: number;
  latency: number;
}

export interface StreamPayload {
  id: string;
  timestamp: number;
  metrics: MetricSnapshot;
  event: StreamEvent;
  services: ServiceLoad[];
  health: HealthCategory[];
  regions: RegionActivity[];
}

export interface DashboardFilters {
  severity: import('./events').SeverityLevel | 'all';
  search: string;
  timeRange: TimeRangeKey;
}
