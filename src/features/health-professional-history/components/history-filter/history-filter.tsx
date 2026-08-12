import { Filter, X } from 'lucide-react';
import { Field } from '../../../../components/field/field';
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
        <input
          type="date"
          value={startDateInput}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </Field>

      <Field label="Até">
        <input
          type="date"
          value={endDateInput}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
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
