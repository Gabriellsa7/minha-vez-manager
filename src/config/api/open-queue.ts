import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueue } from '../entities/queue/queue.entity';

export type OpenQueueResponse = IQueue;

const openQueue = async (queueId: string): Promise<OpenQueueResponse> => {
  const path = `/queues/${queueId}/open`;

  const response = await apiClient.patch<OpenQueueResponse>(path);

  return response.data;
};

export const useOpenQueue = (
  options?: UseMutationOptions<OpenQueueResponse, unknown, string>
) => {
  return useMutation({
    mutationFn: openQueue,
    ...options,
  });
};
