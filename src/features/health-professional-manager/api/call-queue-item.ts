import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../../services/axios';

export const CALL_QUEUE_ITEM = 'CALL_QUEUE_ITEM';

const callQueueItem = async (queueItemId: string) => {
  const path = `/queue-items/${queueItemId}/call`;
  try {
    const response = await apiClient.patch(path);
    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useCallQueueItem = (
  options?: UseMutationOptions<unknown, Error, string>
) => {
  return useMutation({
    mutationKey: [CALL_QUEUE_ITEM],
    mutationFn: callQueueItem,
    ...options,
  });
};
