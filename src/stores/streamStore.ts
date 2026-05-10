import { defineStore } from 'pinia';
import type { ConnectionStatus } from '@/types/metrics';
import { MAX_REJECTED_PAYLOADS } from '@/utils/constants';
import { prependLimited } from '@/utils/performance';

interface RejectedPayloadRecord {
  id: string;
  timestamp: number;
  reason: string;
}

export const useStreamStore = defineStore('stream', {
  state: () => ({
    status: 'offline' as ConnectionStatus,
    reconnectAttempts: 0,
    lastError: null as string | null,
    lastHeartbeat: null as number | null,
    rejectedPayloads: [] as RejectedPayloadRecord[],
  }),
  getters: {
    isLive: (state) => state.status === 'connected',
    hasTransportIssue: (state) => state.status === 'offline' || state.status === 'reconnecting',
  },
  actions: {
    setStatus(status: ConnectionStatus) {
      this.status = status;
      if (status === 'connected') {
        this.reconnectAttempts = 0;
      }
      if (status === 'reconnecting') {
        this.reconnectAttempts += 1;
      }
    },
    setError(message: string | null) {
      this.lastError = message;
    },
    heartbeat(timestamp: number) {
      this.lastHeartbeat = timestamp;
    },
    recordRejectedPayload(reason: string) {
      this.rejectedPayloads = prependLimited(
        this.rejectedPayloads,
        {
          id: `reject-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          timestamp: Date.now(),
          reason,
        },
        MAX_REJECTED_PAYLOADS,
      );
    },
  },
});
