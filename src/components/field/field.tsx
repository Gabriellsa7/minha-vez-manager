import { AlertCircle } from 'lucide-react';
import style from './field.module.scss';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`${style.field} ${error ? style.invalid : ''}`}>
      <span>{label}</span>
      {children}
      {error && (
        <small className={style.error}>
          <AlertCircle size={12} />
          {error}
        </small>
      )}
    </label>
  );
}

export { Field };
