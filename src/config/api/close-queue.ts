import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueue } from '../entities/queue/queue.entity';

export type CloseQueueResponse = IQueue;

export interface CloseQueueParams {
  queueId: string;
  reason?: string;
}

const closeQueue = async ({
  queueId,
  reason,
}: CloseQueueParams): Promise<CloseQueueResponse> => {
  const path = `/queues/${queueId}/close`;

  try {
    const response = await apiClient.patch<CloseQueueResponse>(path, {
      reason,
    });

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
