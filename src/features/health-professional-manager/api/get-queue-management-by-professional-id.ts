import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { IQueueManagement } from '../../../config/entities/queue-management/queue-management.entity';
import { apiClient } from '../../../services/axios';
import { AxiosError } from 'axios';

export const GET_QUEUE_MANAGEMENT = 'GET_QUEUE_MANAGEMENT';

export type GetQueueManagementResponse = IQueueManagement | null;

const getQueueManagement = async (
  professionalId: string
): Promise<GetQueueManagementResponse> => {
  const path = `/queue/professional/${professionalId}/management`;

  try {
    const response = await apiClient.get<GetQueueManagementResponse>(path);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const useGetQueueManagement = (
  professionalId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetQueueManagementResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_QUEUE_MANAGEMENT, professionalId],

    queryFn: () => getQueueManagement(professionalId!),

    enabled: Boolean(professionalId),

    ...options,
  });
};
