import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueueItem } from '../entities/queue-item/queue-item.entity';

export const GET_QUEUE_ITEM_BY_PROFESSIONAL_ID =
  'GET_QUEUE_ITEM_BY_PROFESSIONAL_ID';

export type GetQueueItemByProfessionalIdResponse = IQueueItem[];

const getQueueItemByProfessionalId = async (
  professionalId: string
): Promise<GetQueueItemByProfessionalIdResponse> => {
  const path = `/queue-items/professionals/${professionalId}`;
  try {
    const response =
      await apiClient.get<GetQueueItemByProfessionalIdResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useGetQueueItemByProfessionalId = (
  professionalId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetQueueItemByProfessionalIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_QUEUE_ITEM_BY_PROFESSIONAL_ID, professionalId],
    queryFn: () => getQueueItemByProfessionalId(professionalId!),
    enabled: Boolean(professionalId),
    ...options,
  });
};
