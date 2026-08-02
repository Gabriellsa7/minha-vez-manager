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
    <label className={style.field}>
      <span>{label}</span>
      {children}
      {error && <small className={style.error}>{error}</small>}
    </label>
  );
}

export { Field };
