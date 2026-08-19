import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamBooking } from '../entities/exam-booking/exam-booking.entity';

export const GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY =
  'GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY';

interface IPaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

const getExamBookingsByPatientId = async (
  patientId: string
): Promise<IExamBooking[]> => {
  const path = `/patients/${patientId}/exam-bookings`;

  const response = await apiClient.get<IPaginatedResponse<IExamBooking>>(path);

  return response.data.data;
};

export const useGetExamBookingsByPatientId = (
  patientId: string | undefined,
  options?: Omit<UseQueryOptions<IExamBooking[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY, patientId],
    queryFn: () => getExamBookingsByPatientId(patientId!),
    enabled: Boolean(patientId),
    ...options,
  });
};
