import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import style from './select.module.scss';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: React.Ref<HTMLSelectElement>;
};

function Select({ className, children, ...props }: SelectProps) {
  return (
    <span className={style.wrapper}>
      <select className={`${style.select} ${className ?? ''}`} {...props}>
        {children}
      </select>
      <ChevronDown size={16} className={style.icon} aria-hidden />
    </span>
  );
}

export { Select };
