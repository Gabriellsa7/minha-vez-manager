import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueueItem } from '../entities/queue-item/queue-item.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_QUEUE_ITEM_BY_PATIENT_ID } from './get-queue-item-by-patient-id';

export const CHECK_IN_QUEUE_ITEM = 'CHECK_IN_QUEUE_ITEM';

const checkInQueueItem = async (queueItemId: string): Promise<IQueueItem> => {
  const path = `/queue-items/${queueItemId}/check-in`;
  const response = await apiClient.patch<IQueueItem>(path);
  return response.data;
};

export const useCheckInQueueItem = (
  options?: UseMutationOptions<IQueueItem, unknown, string>
) => {
  return useMutation({
    mutationKey: [CHECK_IN_QUEUE_ITEM],
    mutationFn: checkInQueueItem,
    ...withInvalidation([GET_QUEUE_ITEM_BY_PATIENT_ID], options),
  });
};
