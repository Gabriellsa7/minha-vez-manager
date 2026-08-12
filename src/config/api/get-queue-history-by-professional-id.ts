import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueueHistoryEntry } from '../entities/queue-history/queue-history.entity';

export const GET_QUEUE_HISTORY_BY_PROFESSIONAL_ID_KEY =
  'GET_QUEUE_HISTORY_BY_PROFESSIONAL_ID_KEY';

export interface GetQueueHistoryParams {
  professionalId: string;
  startDate?: string;
  endDate?: string;
}

const getQueueHistoryByProfessionalId = async ({
  professionalId,
  startDate,
  endDate,
}: GetQueueHistoryParams): Promise<IQueueHistoryEntry[]> => {
  const path = `/queue/professional/${professionalId}/history`;

  const response = await apiClient.get<IQueueHistoryEntry[]>(path, {
    params: {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
  });

  return response.data;
};

export const useGetQueueHistoryByProfessionalId = (
  params: Partial<GetQueueHistoryParams>,
  options?: Omit<UseQueryOptions<IQueueHistoryEntry[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [
      GET_QUEUE_HISTORY_BY_PROFESSIONAL_ID_KEY,
      params.professionalId,
      params.startDate,
      params.endDate,
    ],
    queryFn: () =>
      getQueueHistoryByProfessionalId({
        professionalId: params.professionalId!,
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    enabled: Boolean(params.professionalId),
    ...options,
  });
};
