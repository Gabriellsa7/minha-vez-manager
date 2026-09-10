import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueueItem } from '../entities/queue-item/queue-item.entity';

export const GET_QUEUE_ITEM_BY_PATIENT_ID = 'GET_QUEUE_ITEM_BY_PATIENT_ID';

export type GetQueueItemByPatientIdResponse = IQueueItem[];

export const getQueueItemByPatientId = async (
  patientId: string
): Promise<GetQueueItemByPatientIdResponse> => {
  const path = `/queue-items/patient/${patientId}`;
  try {
    const response =
      await apiClient.get<GetQueueItemByPatientIdResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useGetQueueItemByPatientId = (
  patientId: string | undefined,
  options?: Omit<
    UseQueryOptions<GetQueueItemByPatientIdResponse>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [GET_QUEUE_ITEM_BY_PATIENT_ID, patientId],
    queryFn: () => getQueueItemByPatientId(patientId!),
    enabled: Boolean(patientId),
    ...options,
  });
};
