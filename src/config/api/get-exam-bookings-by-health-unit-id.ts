import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamBooking } from '../entities/exam-booking/exam-booking.entity';

export const GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY =
  'GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY';

export interface GetExamBookingsByHealthUnitIdParams {
  date?: string;
  status?: string;
}

const getExamBookingsByHealthUnitId = async (
  healthUnitId: string,
  params: GetExamBookingsByHealthUnitIdParams
): Promise<IExamBooking[]> => {
  const path = `/health-units/${healthUnitId}/exam-bookings`;

  const response = await apiClient.get<IExamBooking[]>(path, { params });

  return response.data;
};

export const useGetExamBookingsByHealthUnitId = (
  healthUnitId: string | undefined,
  params: GetExamBookingsByHealthUnitIdParams = {},
  options?: Omit<UseQueryOptions<IExamBooking[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY, healthUnitId, params],
    queryFn: () => getExamBookingsByHealthUnitId(healthUnitId!, params),
    enabled: Boolean(healthUnitId),
    ...options,
  });
};
