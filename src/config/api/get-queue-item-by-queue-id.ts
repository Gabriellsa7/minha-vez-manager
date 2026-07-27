import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueueItem } from '../entities/queue-item/queue-item.entity';

export const GET_QUEUE_ITEM_BY_QUEUE_ID = 'GET_QUEUE_ITEM_BY_QUEUE_ID';

export type GetQueueItemByQueueIdResponse = IQueueItem[];

const getQueueItemByQueueId = async (
  queuelId: string
): Promise<GetQueueItemByQueueIdResponse> => {
  const path = `/queue-items/queues/${queuelId}`;
  try {
    const response = await apiClient.get<GetQueueItemByQueueIdResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useGetQueueItemByQueueId = (
  queueId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetQueueItemByQueueIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_QUEUE_ITEM_BY_QUEUE_ID, queueId],
    queryFn: () => getQueueItemByQueueId(queueId!),
    enabled: Boolean(queueId),
    ...options,
  });
};
