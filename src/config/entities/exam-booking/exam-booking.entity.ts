export const examBookingStatus = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type ExamBookingStatus =
  (typeof examBookingStatus)[keyof typeof examBookingStatus];

export interface IExamBooking {
  _id: string;
  patientId: string;
  healthUnitId: string;
  examOfferingId: string;
  examOfferingName: string;
  healthUnitName: string;
  scheduledAt: string;
  durationMinutes: number;
  priceSnapshot?: number;
  status: ExamBookingStatus;
  resultExamId?: string | null;
  cancelReason?: string | null;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
