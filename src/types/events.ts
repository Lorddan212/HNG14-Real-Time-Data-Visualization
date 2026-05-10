export type SeverityLevel = 'info' | 'warning' | 'critical' | 'success';

export interface StreamEvent {
  id: string;
  timestamp: number;
  title: string;
  message: string;
  severity: SeverityLevel;
  source: string;
  region: string;
  service: string;
  metric?: string;
  value?: number;
}

export interface ActivityFilters {
  severity: SeverityLevel | 'all';
  search: string;
}
