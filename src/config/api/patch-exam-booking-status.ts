import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type {
  ExamBookingStatus,
  IExamBooking,
} from '../entities/exam-booking/exam-booking.entity';

export interface PatchExamBookingStatusParams {
  id: string;
  status: ExamBookingStatus;
}

const patchExamBookingStatus = async (
  params: PatchExamBookingStatusParams
): Promise<IExamBooking> => {
  const { data } = await apiClient.patch<IExamBooking>(
    `/exam-bookings/${params.id}/status`,
    { status: params.status }
  );

  return data;
};

export const usePatchExamBookingStatus = (
  options?: UseMutationOptions<
    IExamBooking,
    unknown,
    PatchExamBookingStatusParams
  >
) =>
  useMutation({
    mutationFn: patchExamBookingStatus,
    ...options,
  });
