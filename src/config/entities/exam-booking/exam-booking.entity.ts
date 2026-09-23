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
  patientName: string;
  patientCpf: string;
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

export const EXAM_BOOKING_STATUS_LABEL: Record<ExamBookingStatus, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em atendimento',
  COMPLETED: 'Realizado',
  CANCELED: 'Cancelado',
  NO_SHOW: 'Não compareceu',
};
