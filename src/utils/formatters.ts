import type { ConnectionStatus } from '@/types/metrics';

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${numberFormatter.format(value)}%`;
}

export function formatMs(value: number): string {
  return `${Math.round(value)} ms`;
}

export function formatMbps(value: number): string {
  return `${numberFormatter.format(value)} Mbps`;
}

export function formatTime(timestamp: number): string {
  return timeFormatter.format(new Date(timestamp));
}

export function formatRelativeTime(timestamp?: number | null): string {
  if (!timestamp) {
    return 'No data yet';
  }

  const deltaSeconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));

  if (deltaSeconds < 5) {
    return 'just now';
  }

  if (deltaSeconds < 60) {
    return `${deltaSeconds}s ago`;
  }

  return `${Math.round(deltaSeconds / 60)}m ago`;
}

export function statusLabel(status: ConnectionStatus): string {
  const labels: Record<ConnectionStatus, string> = {
    connected: 'Connected',
    reconnecting: 'Reconnecting',
    offline: 'Offline',
    paused: 'Paused',
  };

  return labels[status];
}
