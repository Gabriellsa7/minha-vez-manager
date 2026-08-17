import { useEffect, useRef, useState } from 'react';
import { DayPicker, type Matcher } from 'react-day-picker';
import { ptBR } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { CalendarDays } from 'lucide-react';
import {
  formatDateDisplayValue,
  formatDateInputValue,
  parseDateInputValue,
} from '../../config/utils';
import style from './date-picker.module.scss';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  align?: 'left' | 'right';
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Selecionar data',
  disabled,
  minDate,
  maxDate,
  align = 'left',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const selectedDate = parseDateInputValue(value);

  const disabledMatchers: Matcher[] = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  const handleSelect = (date?: Date) => {
    if (!date) return;
    onChange(formatDateInputValue(date));
    setIsOpen(false);
  };

  return (
    <div className={style.container} ref={containerRef}>
      <button
        type="button"
        className={style.trigger}
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <CalendarDays size={16} />
        <span className={!selectedDate ? style.placeholder : undefined}>
          {selectedDate ? formatDateDisplayValue(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div
          className={`${style.popover} ${align === 'right' ? style.popoverRight : ''}`}
        >
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
            disabled={disabledMatchers.length ? disabledMatchers : undefined}
            showOutsideDays
            className={style.calendar}
          />
        </div>
      )}
    </div>
  );
}

export { DatePicker };
