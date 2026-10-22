import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import style from './confirm-delete-modal.module.scss';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  isDeleting?: boolean;
  confirmLabel?: string;
  pendingLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDeleteModal({
  open,
  title,
  description,
  isDeleting,
  confirmLabel = 'Confirmar exclusão',
  pendingLabel = 'Excluindo...',
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDeleting, onCancel, open]);

  if (!open) return null;

  const closeModal = () => {
    if (isDeleting) return;
    onCancel();
  };

  return (
    <div className={style.overlay} onMouseDown={closeModal}>
      <div
        className={style.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.icon}>
          <AlertTriangle size={22} />
        </div>

        <h2 id="confirm-delete-modal-title">{title}</h2>
        <p>{description}</p>

        <div className={style.actions}>
          <button
            type="button"
            className={style.cancelButton}
            onClick={closeModal}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={style.confirmButton}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export { ConfirmDeleteModal };
