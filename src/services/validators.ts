import type { SeverityLevel, StreamEvent } from '@/types/events';
import type {
  HealthCategory,
  MetricSnapshot,
  RegionActivity,
  ServiceLoad,
  StreamPayload,
} from '@/types/metrics';

const severities: SeverityLevel[] = ['info', 'warning', 'critical', 'success'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown, maxLength = 160): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function isFiniteNumber(value: unknown, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function isMetricSnapshot(value: unknown): value is MetricSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isFiniteNumber(value.timestamp, 0) &&
    isFiniteNumber(value.cpu, 0, 100) &&
    isFiniteNumber(value.memory, 0, 100) &&
    isFiniteNumber(value.networkIn, 0, 2_000) &&
    isFiniteNumber(value.networkOut, 0, 2_000) &&
    isFiniteNumber(value.activeUsers, 0, 1_000_000) &&
    isFiniteNumber(value.requestRate, 0, 100_000) &&
    isFiniteNumber(value.errorRate, 0, 100) &&
    isFiniteNumber(value.latency, 0, 5_000) &&
    isFiniteNumber(value.throughput, 0, 10_000)
  );
}

function isStreamEvent(value: unknown): value is StreamEvent {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isFiniteNumber(value.timestamp, 0) &&
    isString(value.title) &&
    isString(value.message, 240) &&
    severities.includes(value.severity as SeverityLevel) &&
    isString(value.source) &&
    isString(value.region) &&
    isString(value.service) &&
    (value.metric === undefined || isString(value.metric)) &&
    (value.value === undefined || isFiniteNumber(value.value))
  );
}

function isServiceLoad(value: unknown): value is ServiceLoad {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.service) &&
    isFiniteNumber(value.requests, 0, 500_000) &&
    isFiniteNumber(value.errors, 0, 500_000) &&
    isFiniteNumber(value.latency, 0, 5_000)
  );
}

function isHealthCategory(value: unknown): value is HealthCategory {
  if (!isRecord(value)) {
    return false;
  }

  return isString(value.name) && isFiniteNumber(value.score, 0, 100);
}

function isRegionActivity(value: unknown): value is RegionActivity {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.region) &&
    isFiniteNumber(value.activity, 0, 10_000_000) &&
    isFiniteNumber(value.errors, 0, 100_000) &&
    isFiniteNumber(value.latency, 0, 5_000)
  );
}

export function validateStreamPayload(value: unknown): StreamPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const payload = value as Record<string, unknown>;

  if (
    !isString(payload.id) ||
    !isFiniteNumber(payload.timestamp, 0) ||
    !isMetricSnapshot(payload.metrics) ||
    !isStreamEvent(payload.event) ||
    !Array.isArray(payload.services) ||
    !Array.isArray(payload.health) ||
    !Array.isArray(payload.regions)
  ) {
    return null;
  }

  if (!payload.services.every(isServiceLoad) || !payload.health.every(isHealthCategory) || !payload.regions.every(isRegionActivity)) {
    return null;
  }

  return {
    id: payload.id,
    timestamp: payload.timestamp,
    metrics: payload.metrics,
    event: payload.event,
    services: payload.services,
    health: payload.health,
    regions: payload.regions,
  };
}
