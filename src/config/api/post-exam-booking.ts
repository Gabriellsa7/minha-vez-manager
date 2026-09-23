import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamBooking } from '../entities/exam-booking/exam-booking.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_EXAM_SLOTS_KEY } from './get-exam-slots';
import { GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY } from './get-exam-bookings-by-health-unit-id';

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
  const { data } = await apiClient.post<IExamBooking>('/exam-bookings', params);

  return data;
};

export const usePostExamBooking = (
  options?: UseMutationOptions<IExamBooking, unknown, CreateExamBookingParams>
) =>
  useMutation({
    mutationFn: postExamBooking,
    ...withInvalidation(
      [GET_EXAM_SLOTS_KEY, GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY],
      options
    ),
  });
