import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueue } from '../entities/queue/queue.entity';

export type OpenQueueResponse = IQueue;

const openQueue = async (queueId: string): Promise<OpenQueueResponse> => {
  const path = `/queues/${queueId}/open`;

  try {
    const response = await apiClient.patch<OpenQueueResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useOpenQueue = () => {
  return useMutation({
    mutationFn: openQueue,
  });
};
