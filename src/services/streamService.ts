import { generateMalformedPayload, generateStreamPayload } from '@/services/dataGenerator';
import type { ConnectionStatus } from '@/types/metrics';
import { STREAM_INTERVAL_MS } from '@/utils/constants';

interface StreamError {
  code: string;
  message: string;
}

interface StreamMessageMap {
  payload: unknown;
  status: ConnectionStatus;
  error: StreamError;
}

type StreamListener<K extends keyof StreamMessageMap> = (message: StreamMessageMap[K]) => void;

class MockStreamService {
  private listeners: {
    [K in keyof StreamMessageMap]: Set<StreamListener<K>>;
  } = {
    payload: new Set(),
    status: new Set(),
    error: new Set(),
  };

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private reconnectTimerId: ReturnType<typeof setTimeout> | null = null;
  private status: ConnectionStatus = 'offline';
  private reconnectAttempts = 0;
  private nextInstabilityAt = Date.now() + 24_000;

  subscribe<K extends keyof StreamMessageMap>(event: K, listener: StreamListener<K>): () => void {
    this.listeners[event].add(listener);
    return () => this.listeners[event].delete(listener);
  }

  start(): void {
    this.clearReconnectTimer();
    this.reconnectAttempts = 0;
    this.setStatus('connected');
    this.emit('payload', generateStreamPayload());
    this.ensureInterval();
  }

  pause(): void {
    if (this.status === 'paused') {
      return;
    }

    this.clearInterval();
    this.setStatus('paused');
  }

  resume(): void {
    if (this.status !== 'paused') {
      return;
    }

    this.start();
  }

  stop(): void {
    this.clearInterval();
    this.clearReconnectTimer();
    this.setStatus('offline');
  }

  simulateReconnect(): void {
    if (this.status === 'paused') {
      return;
    }

    this.clearInterval();
    this.setStatus('reconnecting');
    this.reconnectAttempts += 1;

    const backoff = Math.min(8_000, 900 * 2 ** Math.min(this.reconnectAttempts, 4));
    const jitter = Math.round(Math.random() * 600);

    this.reconnectTimerId = setTimeout(() => {
      this.reconnectTimerId = null;
      this.start();
      this.emit('error', {
        code: 'STREAM_RECONNECTED',
        message: 'Stream reconnected after transient transport interruption.',
      });
    }, backoff + jitter);
  }

  forceOffline(): void {
    this.clearInterval();
    this.clearReconnectTimer();
    this.setStatus('offline');
    this.emit('error', {
      code: 'STREAM_OFFLINE',
      message: 'Stream moved offline. Reconnect to resume live telemetry.',
    });
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private ensureInterval(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      const emitMalformed = Math.random() < 0.035;
      this.emit('payload', emitMalformed ? generateMalformedPayload() : generateStreamPayload());

      if (Date.now() > this.nextInstabilityAt && Math.random() < 0.22) {
        this.nextInstabilityAt = Date.now() + 34_000 + Math.random() * 18_000;
        this.emit('error', {
          code: 'STREAM_TRANSPORT_RESET',
          message: 'Transport heartbeat missed. Attempting reconnect.',
        });
        this.simulateReconnect();
      }
    }, STREAM_INTERVAL_MS);
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimerId) {
      clearTimeout(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }
  }

  private setStatus(status: ConnectionStatus): void {
    if (this.status === status) {
      return;
    }

    this.status = status;
    this.emit('status', status);
  }

  private emit<K extends keyof StreamMessageMap>(event: K, message: StreamMessageMap[K]): void {
    this.listeners[event].forEach((listener) => listener(message));
  }
}

export const streamService = new MockStreamService();
