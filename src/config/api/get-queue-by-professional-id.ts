import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueue } from '../entities/queue/queue.entity';

export const GET_QUEUE_BY_PROFESSIONAL_ID = 'GET_QUEUE_BY_PROFESSIONAL_ID';

export type GetQueueByProfessionalIdResponse = IQueue;

const getQueueByProfessionalId = async (
  professionalId: string
): Promise<GetQueueByProfessionalIdResponse> => {
  const path = `/queue/professional/${professionalId}`;
  try {
    const response =
      await apiClient.get<GetQueueByProfessionalIdResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useGetQueueByProfessionalId = (
  professionalId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetQueueByProfessionalIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_QUEUE_BY_PROFESSIONAL_ID, professionalId],
    queryFn: () => getQueueByProfessionalId(professionalId!),
    enabled: Boolean(professionalId),
    ...options,
  });
};
