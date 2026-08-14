import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_EXAM_PROFESSIONAL_MANAGER } from '../exam-professional-manager/constants';
import { ExamProfessionalUploadForm } from './components/exam-professional-upload-form/exam-professional-upload-form';
import style from './exam-professional-upload.module.scss';

function ExamProfessionalUpload() {
  const { data: user } = useCurrentUser();

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_EXAM_PROFESSIONAL_MANAGER}
        pageTitle="Painel de Exames"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Enviar resultado de exame"
          subtitle="Busque o paciente pelo CPF e envie o PDF do exame realizado"
          onButtonClick={() => {}}
          user={user}
        />

        <div className={style.content}>
          <ExamProfessionalUploadForm />
        </div>
      </div>
    </div>
  );
}

export { ExamProfessionalUpload };
