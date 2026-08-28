import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';

export interface IExamSlotAvailability {
  time: string;
  remainingCapacity: number;
}

export interface GetExamSlotsResponse {
  date: string;
  slots: IExamSlotAvailability[];
}

export const GET_EXAM_SLOTS_KEY = 'GET_EXAM_SLOTS_KEY';

const getExamSlots = async (
  healthUnitId: string,
  date: string
): Promise<GetExamSlotsResponse> => {
  const path = `/health-units/${healthUnitId}/exam-slots`;

  const response = await apiClient.get<GetExamSlotsResponse>(path, {
    params: { date },
  });

  return response.data;
};

export const useGetExamSlots = (
  healthUnitId: string | undefined,
  date: string,
  options?: Omit<UseQueryOptions<GetExamSlotsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAM_SLOTS_KEY, healthUnitId, date],
    queryFn: () => getExamSlots(healthUnitId!, date),
    enabled: Boolean(healthUnitId) && Boolean(date),
    ...options,
  });
};
