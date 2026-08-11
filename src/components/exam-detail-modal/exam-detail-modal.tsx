import { Download, X } from 'lucide-react';
import { useGetExamById } from '../../config/api/get-exam-by-id';
import { formatDate } from '../../config/utils';
import { handleApiError } from '../../config/utils/handle-api-error';
import style from './exam-detail-modal.module.scss';

interface ExamDetailModalProps {
  examId: string | null;
  onClose: () => void;
}

async function downloadFile(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    handleApiError(error);
  }
}

function ExamDetailModal({ examId, onClose }: ExamDetailModalProps) {
  const { data: exam, isLoading } = useGetExamById(examId ?? undefined);

  if (!examId) return null;

  return (
    <div className={style.overlay} onMouseDown={onClose}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-detail-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <div>
            <h2 id="exam-detail-modal-title">{exam?.examType ?? 'Exame'}</h2>
            {exam && (
              <p className={style.subtitle}>
                {exam.patientName} · {exam.patientCpf}
                {exam.examDate && <> · {formatDate(exam.examDate)}</>}
              </p>
            )}
          </div>
          <div className={style.actions}>
            {exam && (
              <button
                type="button"
                className={style.downloadButton}
                onClick={() => downloadFile(exam.fileUrl, exam.fileName)}
              >
                <Download size={16} />
                Baixar
              </button>
            )}
            <button
              type="button"
              className={style.closeButton}
              onClick={onClose}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={style.body}>
          {isLoading || !exam ? (
            <p className={style.loading}>Carregando exame...</p>
          ) : (
            <iframe
              src={exam.fileUrl}
              title={exam.fileName}
              className={style.viewer}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { ExamDetailModal };
