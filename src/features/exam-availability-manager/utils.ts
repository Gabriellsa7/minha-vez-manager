import { WeekDay } from '../../config/entities/health-unit/health-unit.entity';

export interface RuleRow {
  weekday: WeekDay;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  capacityPerSlot: number;
}

export const WEEKDAY_ORDER: WeekDay[] = [
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY,
  WeekDay.SUNDAY,
];

export function defaultRows(): RuleRow[] {
  return WEEKDAY_ORDER.map((weekday) => ({
    weekday,
    enabled: false,
    startTime: '08:00',
    endTime: '12:00',
    slotDurationMinutes: 15,
    capacityPerSlot: 1,
  }));
}
