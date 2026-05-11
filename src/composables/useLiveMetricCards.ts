import { computed } from 'vue';
import { Activity, AlertTriangle, Cpu, HardDrive, RadioTower, Timer, Users } from 'lucide-vue-next';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { MetricSnapshot } from '@/types/metrics';

function readMetric(point: MetricSnapshot | null, key: keyof MetricSnapshot): number {
  const value = point?.[key];
  return typeof value === 'number' ? value : 0;
}

export function useLiveMetricCards() {
  const dashboard = useDashboardStore();
  const filteredMetrics = computed(() => dashboard.filteredMetrics);
  const latest = computed(() => dashboard.latestMetric);
  const previous = computed(() => dashboard.previousMetric);

  function trendFor(key: keyof MetricSnapshot): number {
    const current = readMetric(latest.value, key);
    const before = readMetric(previous.value, key);

    if (!before) {
      return 0;
    }

    return ((current - before) / before) * 100;
  }

  const metricCards = computed(() => [
    {
      title: 'CPU Usage',
      value: readMetric(latest.value, 'cpu'),
      trend: trendFor('cpu'),
      points: filteredMetrics.value.map((point) => point.cpu),
      format: 'percent' as const,
      tone: 'blue' as const,
      icon: Cpu,
    },
    {
      title: 'Memory Load',
      value: readMetric(latest.value, 'memory'),
      trend: trendFor('memory'),
      points: filteredMetrics.value.map((point) => point.memory),
      format: 'percent' as const,
      tone: 'violet' as const,
      icon: HardDrive,
    },
    {
      title: 'Network Traffic',
      value: (latest.value?.networkIn ?? 0) + (latest.value?.networkOut ?? 0),
      trend: trendFor('networkIn'),
      points: filteredMetrics.value.map((point) => point.networkIn + point.networkOut),
      format: 'mbps' as const,
      tone: 'cyan' as const,
      icon: RadioTower,
    },
    {
      title: 'Active Users',
      value: readMetric(latest.value, 'activeUsers'),
      trend: trendFor('activeUsers'),
      points: filteredMetrics.value.map((point) => point.activeUsers),
      format: 'compact' as const,
      tone: 'emerald' as const,
      icon: Users,
    },
    {
      title: 'Request Rate',
      value: readMetric(latest.value, 'requestRate'),
      trend: trendFor('requestRate'),
      points: filteredMetrics.value.map((point) => point.requestRate),
      format: 'compact' as const,
      tone: 'amber' as const,
      icon: Activity,
    },
    {
      title: 'Error Rate',
      value: readMetric(latest.value, 'errorRate'),
      trend: trendFor('errorRate'),
      points: filteredMetrics.value.map((point) => point.errorRate),
      format: 'percent' as const,
      tone: 'red' as const,
      icon: AlertTriangle,
    },
    {
      title: 'Latency',
      value: readMetric(latest.value, 'latency'),
      trend: trendFor('latency'),
      points: filteredMetrics.value.map((point) => point.latency),
      format: 'ms' as const,
      tone: 'blue' as const,
      icon: Timer,
    },
  ]);

  return {
    filteredMetrics,
    metricCards,
  };
}
