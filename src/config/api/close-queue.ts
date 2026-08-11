import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueue } from '../entities/queue/queue.entity';

export type CloseQueueResponse = IQueue;

const closeQueue = async (queueId: string): Promise<CloseQueueResponse> => {
  const path = `/queues/${queueId}/close`;

  try {
    const response = await apiClient.patch<CloseQueueResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useCloseQueue = () => {
  return useMutation({
    mutationFn: closeQueue,
  });
};
