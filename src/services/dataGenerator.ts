import { REGIONS, SERVICES, SOURCES } from '@/utils/constants';
import { clamp } from '@/utils/performance';
import type { SeverityLevel, StreamEvent } from '@/types/events';
import type {
  HealthCategory,
  MetricSnapshot,
  RegionActivity,
  ServiceLoad,
  StreamPayload,
} from '@/types/metrics';

interface GeneratorState {
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

const state: GeneratorState = {
  cpu: 42,
  memory: 58,
  networkIn: 460,
  networkOut: 220,
  activeUsers: 14_200,
  requestRate: 1_850,
  errorRate: 0.8,
  latency: 88,
  throughput: 96,
};

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function walk(current: number, volatility: number, min: number, max: number): number {
  const seasonal = Math.sin(Date.now() / 18_000) * volatility * 0.35;
  return clamp(current + randomBetween(-volatility, volatility) + seasonal, min, max);
}

function nextSeverity(metrics: GeneratorState): SeverityLevel {
  if (metrics.cpu > 88 || metrics.errorRate > 4.8 || metrics.latency > 220) {
    return 'critical';
  }

  if (metrics.cpu > 74 || metrics.errorRate > 2.2 || metrics.memory > 82 || metrics.latency > 160) {
    return 'warning';
  }

  if (Math.random() > 0.78) {
    return 'success';
  }

  return 'info';
}

function makeMetricSnapshot(timestamp: number): MetricSnapshot {
  state.cpu = walk(state.cpu, 8, 8, 98);
  state.memory = walk(state.memory, 3.4, 22, 94);
  state.networkIn = walk(state.networkIn, 86, 60, 980);
  state.networkOut = walk(state.networkOut, 62, 30, 720);
  state.activeUsers = Math.round(walk(state.activeUsers, 540, 6_500, 30_000));
  state.requestRate = Math.round(walk(state.requestRate, 210, 320, 4_600));
  state.errorRate = walk(state.errorRate, 0.48, 0, 7.5);
  state.latency = walk(state.latency, 18, 38, 280);
  state.throughput = walk(state.throughput, 8, 35, 150);

  return {
    id: `metric-${timestamp}`,
    timestamp,
    cpu: Number(state.cpu.toFixed(2)),
    memory: Number(state.memory.toFixed(2)),
    networkIn: Number(state.networkIn.toFixed(2)),
    networkOut: Number(state.networkOut.toFixed(2)),
    activeUsers: state.activeUsers,
    requestRate: state.requestRate,
    errorRate: Number(state.errorRate.toFixed(2)),
    latency: Number(state.latency.toFixed(2)),
    throughput: Number(state.throughput.toFixed(2)),
  };
}

function makeEvent(timestamp: number, metrics: MetricSnapshot): StreamEvent {
  const severity = nextSeverity(state);
  const service = pick(SERVICES);
  const source = pick(SOURCES);
  const region = pick(REGIONS);

  const templates: Record<SeverityLevel, string[]> = {
    info: [
      'Telemetry batch accepted',
      'Cache synchronization completed',
      'Regional heartbeat received',
      'Autoscaling policy evaluated',
    ],
    warning: [
      'Latency approaching threshold',
      'Elevated memory pressure detected',
      'Traffic spike observed',
      'Retry queue growing',
    ],
    critical: [
      'Error budget burn accelerated',
      'Anomaly detected in auth flow',
      'Packet loss crossed guardrail',
      'Service saturation event',
    ],
    success: [
      'Failover drill passed',
      'Queue depth normalized',
      'Recovery action completed',
      'Deployment health gate passed',
    ],
  };

  const metric =
    severity === 'critical'
      ? 'errorRate'
      : severity === 'warning'
        ? 'latency'
        : Math.random() > 0.5
          ? 'requestRate'
          : 'cpu';

  const valueMap: Record<string, number> = {
    errorRate: metrics.errorRate,
    latency: metrics.latency,
    requestRate: metrics.requestRate,
    cpu: metrics.cpu,
  };

  return {
    id: `evt-${timestamp}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp,
    title: pick(templates[severity]),
    message: `${service} reported ${metric} at ${Number(valueMap[metric].toFixed(2))}`,
    severity,
    source,
    region,
    service,
    metric,
    value: Number(valueMap[metric].toFixed(2)),
  };
}

function makeServices(metrics: MetricSnapshot): ServiceLoad[] {
  return SERVICES.map((service, index) => {
    const trafficBias = 1 + index * 0.09;
    const errorBias = service === 'Auth' && metrics.errorRate > 2 ? 1.8 : 1;

    return {
      service,
      requests: Math.round(metrics.requestRate * trafficBias * randomBetween(0.12, 0.26)),
      errors: Math.round(metrics.errorRate * errorBias * randomBetween(1, 8)),
      latency: Math.round(metrics.latency * randomBetween(0.72, 1.42)),
    };
  });
}

function makeHealth(metrics: MetricSnapshot): HealthCategory[] {
  return [
    { name: 'Compute', score: clamp(100 - metrics.cpu * 0.72, 18, 99) },
    { name: 'Memory', score: clamp(100 - metrics.memory * 0.66, 20, 99) },
    { name: 'Network', score: clamp(100 - metrics.networkIn / 16, 22, 98) },
    { name: 'Security', score: clamp(97 - metrics.errorRate * 7, 30, 99) },
    { name: 'Latency', score: clamp(105 - metrics.latency / 2.5, 20, 99) },
    { name: 'Reliability', score: clamp(100 - metrics.errorRate * 9, 25, 99) },
  ].map((category) => ({ ...category, score: Number(category.score.toFixed(1)) }));
}

function makeRegions(metrics: MetricSnapshot): RegionActivity[] {
  return REGIONS.map((region, index) => ({
    region,
    activity: Math.round(metrics.activeUsers * randomBetween(0.08, 0.32) * (1 + index * 0.03)),
    errors: Math.round(metrics.errorRate * randomBetween(1, 12)),
    latency: Math.round(metrics.latency * randomBetween(0.82, 1.34)),
  }));
}

export function generateStreamPayload(): StreamPayload {
  const timestamp = Date.now();
  const metrics = makeMetricSnapshot(timestamp);

  return {
    id: `payload-${timestamp}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp,
    metrics,
    event: makeEvent(timestamp, metrics),
    services: makeServices(metrics),
    health: makeHealth(metrics),
    regions: makeRegions(metrics),
  };
}

export function generateMalformedPayload(): unknown {
  const variants: unknown[] = [
    null,
    { timestamp: Date.now(), metrics: { cpu: 'hot' } },
    { id: 'bad-payload', event: { severity: 'panic' } },
    { id: 'bad-series', timestamp: Date.now(), metrics: { cpu: 140, memory: -1 } },
  ];

  return pick(variants);
}
