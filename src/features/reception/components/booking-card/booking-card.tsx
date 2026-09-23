import type { ReactNode } from 'react';
import { CalendarCheck } from 'lucide-react';
import style from './booking-card.module.scss';

interface BookingCardProps {
  title: string;
  isLocked: boolean;
  lockedHint: string;
  confirmLabel: string;
  pendingLabel: string;
  canConfirm: boolean;
  isPending: boolean;
  onConfirm: () => void;
  children: ReactNode;
}

function BookingCard({
  title,
  isLocked,
  lockedHint,
  confirmLabel,
  pendingLabel,
  canConfirm,
  isPending,
  onConfirm,
  children,
}: BookingCardProps) {
  return (
    <section className={style.card} aria-label={title}>
      <div className={style.header}>
        <h2 className={style.title}>{title}</h2>
        {isLocked && <p className={style.hint}>{lockedHint}</p>}
      </div>

      <fieldset className={style.fieldset} disabled={isLocked}>
        {children}

        <button
          type="button"
          className={style.confirmButton}
          disabled={!canConfirm || isPending}
          onClick={onConfirm}
        >
          <CalendarCheck size={16} aria-hidden />
          {isPending ? pendingLabel : confirmLabel}
        </button>
      </fieldset>
    </section>
  );
}

export { BookingCard };
