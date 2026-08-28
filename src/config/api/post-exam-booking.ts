import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamBooking } from '../entities/exam-booking/exam-booking.entity';

export interface CreateExamBookingParams {
  patientId: string;
  healthUnitId: string;
  examOfferingId: string;
  scheduledAt: string;
  notes?: string;
}

const postExamBooking = async (
  params: CreateExamBookingParams
): Promise<IExamBooking> => {
  const { data } = await apiClient.post<IExamBooking>(
    '/exam-bookings',
    params
  );

  return data;
};

export const usePostExamBooking = (
  options?: UseMutationOptions<IExamBooking, unknown, CreateExamBookingParams>
) => useMutation({ mutationFn: postExamBooking, ...options });
