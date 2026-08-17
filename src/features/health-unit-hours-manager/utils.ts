import {
  WeekDay,
  type IHealthUnitOpeningHours,
} from '../../config/entities/health-unit/health-unit.entity';

export const WEEKDAY_ORDER: WeekDay[] = [
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY,
  WeekDay.SUNDAY,
];

export function defaultOpeningHours(): IHealthUnitOpeningHours[] {
  return WEEKDAY_ORDER.map((day) => ({
    day,
    open: '08:00',
    close: '18:00',
    isClosed: false,
  }));
}
