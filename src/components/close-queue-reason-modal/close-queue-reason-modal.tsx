import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import style from './close-queue-reason-modal.module.scss';

interface CloseQueueReasonModalProps {
  isClosing?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

// Mounted by the parent only while the modal should be visible, so state
// naturally starts fresh on every open instead of needing a reset effect.
function CloseQueueReasonModal({
  isClosing,
  onCancel,
  onConfirm,
}: CloseQueueReasonModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isClosing) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isClosing, onCancel]);

  const closeModal = () => {
    if (isClosing) return;
    onCancel();
  };

  const trimmedReason = reason.trim();
  const canConfirm = trimmedReason.length > 0 && !isClosing;

  return (
    <div className={style.overlay} onMouseDown={closeModal}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="close-queue-reason-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.icon}>
          <AlertTriangle size={22} />
        </div>

        <h2 id="close-queue-reason-modal-title">Fechar fila sem atendimentos</h2>
        <p>
          Nenhum paciente foi atendido nesta fila. Descreva o motivo do
          fechamento para que os pacientes que estavam aguardando sejam
          avisados.
        </p>

        <textarea
          className={style.textarea}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Ex.: Emergência médica, imprevisto pessoal..."
          rows={4}
          disabled={isClosing}
          autoFocus
        />

        <div className={style.actions}>
          <button
            type="button"
            className={style.cancelButton}
            onClick={closeModal}
            disabled={isClosing}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={style.confirmButton}
            onClick={() => onConfirm(trimmedReason)}
            disabled={!canConfirm}
          >
            {isClosing ? 'Fechando...' : 'Confirmar fechamento'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { CloseQueueReasonModal };
