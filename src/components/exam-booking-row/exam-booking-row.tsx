import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  EXAM_BOOKING_STATUS_LABEL,
  type IExamBooking,
} from '../../config/entities/exam-booking/exam-booking.entity';
import { formatDate, formatTime } from '../../config/utils';
import style from './exam-booking-row.module.scss';

interface ExamBookingRowProps {
  booking: IExamBooking;
  showDate?: boolean;
  children?: ReactNode;
}

function ExamBookingRow({
  booking,
  showDate = false,
  children,
}: ExamBookingRowProps) {
  return (
    <div className={style.row}>
      <div className={style.info}>
        <span className={style.patient}>{booking.patientName}</span>
        <span className={style.time}>
          {showDate && `${formatDate(booking.scheduledAt, 'UTC')} `}
          {formatTime(booking.scheduledAt, 'UTC')}
        </span>
        <span>{booking.examOfferingName}</span>
        <span className={`${style.status} ${style[booking.status]}`}>
          {EXAM_BOOKING_STATUS_LABEL[booking.status]}
        </span>
      </div>
      {children && <div className={style.actions}>{children}</div>}
    </div>
  );
}

interface ExamBookingActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger';
}

function ExamBookingAction({
  variant = 'default',
  className,
  ...props
}: ExamBookingActionProps) {
  return (
    <button
      type="button"
      className={`${style.action} ${variant === 'danger' ? style.danger : ''} ${className ?? ''}`}
      {...props}
    />
  );
}

export { ExamBookingRow, ExamBookingAction };
