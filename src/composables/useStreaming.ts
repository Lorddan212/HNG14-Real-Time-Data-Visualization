import { onBeforeUnmount, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useStreamStore } from '@/stores/streamStore';
import { streamService } from '@/services/streamService';
import { validateStreamPayload } from '@/services/validators';
import { createRafBatcher } from '@/utils/performance';

export function useStreaming() {
  const dashboard = useDashboardStore();
  const stream = useStreamStore();

  const batcher = createRafBatcher<unknown>((items) => {
    items.forEach((rawPayload) => {
      const payload = validateStreamPayload(rawPayload);

      if (!payload) {
        stream.recordRejectedPayload('Malformed stream payload rejected by validator.');
        stream.setError('Malformed payload rejected safely.');
        return;
      }

      dashboard.ingest(payload);
      stream.heartbeat(payload.timestamp);
    });
  });

  const unsubscribeStatus = streamService.subscribe('status', (status) => {
    stream.setStatus(status);
  });

  const unsubscribePayload = streamService.subscribe('payload', (payload) => {
    batcher.schedule(payload);
  });

  const unsubscribeError = streamService.subscribe('error', (error) => {
    stream.setError(error.message);
    if (error.code !== 'STREAM_RECONNECTED') {
      dashboard.setError(error.message);
    }
  });

  onMounted(() => {
    streamService.start();
  });

  onBeforeUnmount(() => {
    unsubscribeStatus();
    unsubscribePayload();
    unsubscribeError();
    batcher.cancel();
    streamService.stop();
  });

  return {
    pause: () => streamService.pause(),
    resume: () => streamService.resume(),
    reconnect: () => streamService.simulateReconnect(),
    offline: () => streamService.forceOffline(),
  };
}
