import { useEffect } from 'react';
import { QueueSocketService } from '../../../services/realtime/queue-socket.service';

export function useQueueRealtime(onEvent: () => void) {
  useEffect(() => {
    const unsubscribe = QueueSocketService.subscribeToSocket(onEvent);
    const stopSocket = QueueSocketService.startSocket();

    return () => {
      unsubscribe();
      stopSocket();
    };
  }, [onEvent]);
}
