import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import style from './empty-state.module.scss';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  compact?: boolean;
  className?: string;
}

function EmptyState({
  title,
  description,
  icon: Icon,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={`${style.container} ${compact ? style.compact : ''} ${className ?? ''}`}
    >
      {Icon && !compact && (
        <span className={style.iconWrapper}>
          <Icon size={22} aria-hidden />
        </span>
      )}
      <p className={style.title}>{title}</p>
      {description && <p className={style.description}>{description}</p>}
    </div>
  );
}

export { EmptyState };
