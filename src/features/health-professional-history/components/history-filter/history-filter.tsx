import { Filter, X } from 'lucide-react';
import { Field } from '../../../../components/field/field';
import { DatePicker } from '../../../../components/date-picker/date-picker';
import style from './history-filter.module.scss';

interface HistoryFilterProps {
  startDateInput: string;
  endDateInput: string;
  hasAppliedFilter: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

function HistoryFilter({
  startDateInput,
  endDateInput,
  hasAppliedFilter,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: HistoryFilterProps) {
  return (
    <div className={style.container}>
      <Field label="De">
        <DatePicker value={startDateInput} onChange={onStartDateChange} />
      </Field>

      <Field label="Até">
        <DatePicker value={endDateInput} onChange={onEndDateChange} />
      </Field>

      <button
        type="button"
        className={style.applyButton}
        onClick={onApply}
        disabled={!startDateInput || !endDateInput}
      >
        <Filter size={16} />
        Filtrar
      </button>

      {hasAppliedFilter && (
        <button type="button" className={style.clearButton} onClick={onClear}>
          <X size={16} />
          Limpar
        </button>
      )}
    </div>
  );
}

export { HistoryFilter };
