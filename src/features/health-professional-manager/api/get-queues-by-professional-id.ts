import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { IQueue } from '../../../config/entities/queue/queue.entity';
import { apiClient } from '../../../services/axios';

export const GET_QUEUES_BY_PROFESSIONAL_ID = 'GET_QUEUES_BY_PROFESSIONAL_ID';

export type GetQueuesByProfessionalIdResponse = IQueue[];

const getQueuesByProfessionalId = async (
  professionalId: string
): Promise<GetQueuesByProfessionalIdResponse> => {
  const path = `/queues/professional/${professionalId}`;

  try {
    const response =
      await apiClient.get<GetQueuesByProfessionalIdResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useGetQueuesByProfessionalId = (
  professionalId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetQueuesByProfessionalIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_QUEUES_BY_PROFESSIONAL_ID, professionalId],
    queryFn: () => getQueuesByProfessionalId(professionalId!),
    enabled: Boolean(professionalId),
    ...options,
  });
};
