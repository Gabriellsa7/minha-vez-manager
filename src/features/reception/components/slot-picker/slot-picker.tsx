import { Clock3 } from 'lucide-react';
import { EmptyState } from '../../../../components/empty-state/empty-state';
import style from './slot-picker.module.scss';

export interface SlotOption {
  time: string;
  disabled?: boolean;
  label?: string;
}

interface SlotPickerProps {
  slots: SlotOption[];
  selectedTime: string;
  onSelect: (time: string) => void;
  isLoading?: boolean;
  emptyMessage: string;
}

function SlotPicker({
  slots,
  selectedTime,
  onSelect,
  isLoading = false,
  emptyMessage,
}: SlotPickerProps) {
  return (
    <div className={style.section}>
      <h3 className={style.title}>Horários disponíveis</h3>

      {isLoading ? (
        <p className={style.loading}>Carregando horários...</p>
      ) : slots.length === 0 ? (
        <EmptyState compact title="Sem horários" description={emptyMessage} />
      ) : (
        <div className={style.grid} role="group" aria-label="Horários">
          {slots.map((slot) => {
            const isSelected = slot.time === selectedTime;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={slot.disabled}
                aria-pressed={isSelected}
                onClick={() => onSelect(slot.time)}
                className={`${style.slot} ${isSelected ? style.selected : ''}`}
              >
                <Clock3 size={14} aria-hidden />
                {slot.label ?? slot.time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { SlotPicker };
