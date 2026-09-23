import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { ExamProfessionalUploadForm } from './components/exam-professional-upload-form/exam-professional-upload-form';
import style from './exam-professional-upload.module.scss';

function ExamProfessionalUpload() {
  const { data: user } = useCurrentUser();

  return (
    <div className={style.mainContent}>
      <HeaderManager
        title="Enviar resultado de exame"
        subtitle="Busque o paciente pelo CPF e envie o PDF do exame realizado"
        user={user}
      />

      <div className={style.content}>
        <ExamProfessionalUploadForm />
      </div>
    </div>
  );
}

export { ExamProfessionalUpload };
