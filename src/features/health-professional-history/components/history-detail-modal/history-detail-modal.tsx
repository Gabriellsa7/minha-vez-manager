import { Calendar, Mail, Phone, User, X } from 'lucide-react';
import type { IQueueHistoryEntry } from '../../../../config/entities/queue-history/queue-history.entity';
import { formatDate, formatDateTime, formatTime } from '../../../../config/utils';
import { PRIORITY_LABEL } from '../../constants';
import style from './history-detail-modal.module.scss';

interface HistoryDetailModalProps {
  entry: IQueueHistoryEntry | null;
  onClose: () => void;
}

function HistoryDetailModal({ entry, onClose }: HistoryDetailModalProps) {
  if (!entry) return null;

  return (
    <div className={style.overlay} onMouseDown={onClose}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-detail-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <div>
            <h2 id="history-detail-modal-title">{entry.user.name}</h2>
            <p className={style.subtitle}>
              Atendimento concluído em {formatDateTime(entry.queueItem.finishedAt)}
            </p>
          </div>
          <button
            className={style.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={style.body}>
          <div className={style.infoRow}>
            <Mail size={16} />
            <span>{entry.user.email}</span>
          </div>

          <div className={style.infoRow}>
            <Phone size={16} />
            <span>{entry.patient.phone || 'Não informado'}</span>
          </div>

          <div className={style.infoRow}>
            <Calendar size={16} />
            <span>
              Nascimento: {formatDate(entry.patient.birthDate) || 'Não informado'}
            </span>
          </div>

          <div className={style.infoRow}>
            <User size={16} />
            <span>CPF: {entry.patient.cpf}</span>
          </div>

          <div className={style.divider} />

          <div className={style.detailsGrid}>
            <div>
              <span className={style.label}>Senha</span>
              <strong>{entry.queueItem.code}</strong>
            </div>

            <div>
              <span className={style.label}>Prioridade</span>
              <strong>
                {PRIORITY_LABEL[entry.patient.priority] ?? entry.patient.priority}
              </strong>
            </div>

            <div>
              <span className={style.label}>Check-in</span>
              <strong>{formatTime(entry.queueItem.checkInTime) || '—'}</strong>
            </div>

            <div>
              <span className={style.label}>Chamado</span>
              <strong>{formatTime(entry.queueItem.calledAt) || '—'}</strong>
            </div>

            <div>
              <span className={style.label}>Data da fila</span>
              <strong>{formatDate(entry.queueDate)}</strong>
            </div>

            <div>
              <span className={style.label}>Turno</span>
              <strong>
                {entry.shift === 'MORNING' ? 'Manhã' : 'Tarde'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HistoryDetailModal };
