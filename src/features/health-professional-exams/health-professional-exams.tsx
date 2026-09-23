import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { ExamCard } from '../../components/exam-card/exam-card';
import { ExamDetailModal } from '../../components/exam-detail-modal/exam-detail-modal';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamsByHealthProfessionalId } from '../../config/api/get-exams-by-health-professional-id';
import style from './health-professional-exams.module.scss';
import { EmptyState } from '../../components/empty-state/empty-state';
import { FileText } from 'lucide-react';

function HealthProfessionalExams() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const { data: exams } = useGetExamsByHealthProfessionalId(user?._id);

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Exames"
          subtitle="Exames dos pacientes que você atendeu"
          user={user}
        />

        <div className={style.content}>
          {exams?.length ? (
            <div className={style.examGrid}>
              {exams.map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  onClick={() => setSelectedExamId(exam._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="Nenhum exame disponível"
              description="Os exames dos pacientes que você atendeu aparecem aqui."
            />
          )}
        </div>
      </div>
      <ExamDetailModal
        examId={selectedExamId}
        onClose={() => setSelectedExamId(null)}
      />
    </>
  );
}

export { HealthProfessionalExams };
