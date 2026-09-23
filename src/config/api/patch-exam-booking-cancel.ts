import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamBooking } from '../entities/exam-booking/exam-booking.entity';
import { withInvalidation } from '../../services/react-query';
import { GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY } from './get-exam-bookings-by-health-unit-id';
import { GET_EXAM_SLOTS_KEY } from './get-exam-slots';

export interface PatchExamBookingCancelParams {
  id: string;
  reason?: string;
}

const patchExamBookingCancel = async (
  params: PatchExamBookingCancelParams
): Promise<IExamBooking> => {
  const { data } = await apiClient.patch<IExamBooking>(
    `/exam-bookings/${params.id}/cancel`,
    { reason: params.reason }
  );

  return data;
};

export const usePatchExamBookingCancel = (
  options?: UseMutationOptions<
    IExamBooking,
    unknown,
    PatchExamBookingCancelParams
  >
) =>
  useMutation({
    mutationFn: patchExamBookingCancel,
    ...withInvalidation(
      [GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY, GET_EXAM_SLOTS_KEY],
      options
    ),
  });
