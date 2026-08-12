import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IExamBooking } from '../entities/exam-booking/exam-booking.entity';

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
    ...options,
  });
