import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { ExamCard } from '../../components/exam-card/exam-card';
import { ExamDetailModal } from '../../components/exam-detail-modal/exam-detail-modal';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamsByHealthProfessionalId } from '../../config/api/get-exams-by-health-professional-id';
import { SIDEBAR_PROFESSIONAL_MANAGER } from '../health-professional-manager/constants';
import style from './health-professional-exams.module.scss';

function HealthProfessionalExams() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const { data: exams } = useGetExamsByHealthProfessionalId(user?._id);

  return (
    <>
      <div className={style.container}>
        <SideBar
          items={SIDEBAR_PROFESSIONAL_MANAGER}
          pageTitle="Painel de Gestão"
          user={user}
        />
        <div className={style.mainContent}>
          <HeaderManager
            title="Exames"
            subtitle="Exames dos pacientes que você atendeu"
            onButtonClick={() => {}}
            user={user}
          />

          <div className={style.examGrid}>
            {exams?.length ? (
              exams.map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  onClick={() => setSelectedExamId(exam._id)}
                />
              ))
            ) : (
              <p className={style.empty}>
                Nenhum exame disponível para os seus pacientes ainda.
              </p>
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

export { HealthProfessionalExams };
