export interface IQueue {
  _id: string;
  professionalId: string;
  healthUnitId: string;
  status: EQueueStatus;
  shift: EQueueShift;
  queueDate: string;
  openedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const queueStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
} as const;

export type EQueueStatus = (typeof queueStatus)[keyof typeof queueStatus];

export const queueShift = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
} as const;

export type EQueueShift = (typeof queueShift)[keyof typeof queueShift];
