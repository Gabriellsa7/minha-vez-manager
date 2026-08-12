import type { WeekDay } from '../health-unit/health-unit.entity';

export interface IExamAvailabilityRule {
  _id?: string;
  healthUnitId?: string;
  weekday: WeekDay;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  capacityPerSlot: number;
  isActive: boolean;
}

export interface IExamAvailabilityBlackout {
  _id: string;
  healthUnitId: string;
  date: string;
  reason?: string;
}
