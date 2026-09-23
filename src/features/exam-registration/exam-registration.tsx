import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { ExamCard } from '../../components/exam-card/exam-card';
import { ExamDetailModal } from '../../components/exam-detail-modal/exam-detail-modal';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { useGetExamsByHealthUnitId } from '../../config/api/get-exams-by-health-unit-id';
import { ExamRegistrationForm } from './components/exam-registration-form/exam-registration-form';
import style from './exam-registration.module.scss';
import { EmptyState } from '../../components/empty-state/empty-state';
import { FileText } from 'lucide-react';

function ExamRegistration() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);

  const healthUnitId = healthUnits?.[0]?._id;
  const { data: exams } = useGetExamsByHealthUnitId(healthUnitId);

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Exames"
          subtitle="Cadastre exames e vincule-os ao paciente pelo CPF"
          user={user}
        />

        <div className={style.content}>
          <ExamRegistrationForm />

          <div className={style.examListSection}>
            <h2>Exames cadastrados</h2>
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
                title="Nenhum exame cadastrado"
                description="Os exames vinculados a pacientes aparecem aqui."
              />
            )}
          </div>
        </div>
      </div>
      <ExamDetailModal
        examId={selectedExamId}
        onClose={() => setSelectedExamId(null)}
      />
    </>
  );
}

export { ExamRegistration };
