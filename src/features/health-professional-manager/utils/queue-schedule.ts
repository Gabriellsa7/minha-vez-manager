import { queueShift } from '../../../config/entities/queue/queue.entity';

const AFTERNOON_SHIFT_START_HOUR = 12;
const AFTERNOON_SHIFT_START_MINUTE = 30;

export function isSameDay(dateA: string, dateB: Date): boolean {
  const a = new Date(dateA);
  return (
    a.getFullYear() === dateB.getFullYear() &&
    a.getMonth() === dateB.getMonth() &&
    a.getDate() === dateB.getDate()
  );
}

export function hasShiftStarted(shift: string, now: Date): boolean {
  if (shift === queueShift.MORNING) return true;

  const afternoonStart = new Date(now);
  afternoonStart.setHours(
    AFTERNOON_SHIFT_START_HOUR,
    AFTERNOON_SHIFT_START_MINUTE,
    0,
    0
  );

  return now.getTime() >= afternoonStart.getTime();
}
