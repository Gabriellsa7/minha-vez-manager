import { useQueryClient } from '@tanstack/react-query';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import {
  GET_HEALTH_PROFESSIONALS_BY_USER_ID,
  useHealthProfessionalById,
} from '../../config/api/get-health-professional-by-id';
import { useUploadHealthProfessionalImage } from '../../config/api/upload-health-professional-image';
import { handleApiError } from '../../config/utils/handle-api-error';
import { SIDEBAR_PROFESSIONAL_MANAGER } from '../health-professional-manager/constants';
import { SIDEBAR_EXAM_PROFESSIONAL_MANAGER } from '../exam-professional-manager/constants';
import { healthProfessionalType } from '../../config/entities/health-profissional/health-professional.entity';
import { AvatarUpload } from './components/avatar-upload/avatar-upload';
import { ProfileForm } from './components/profile-form/profile-form';
import style from './professional-profile.module.scss';

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ProfessionalProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: professional } = useHealthProfessionalById(user?._id);

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadHealthProfessionalImage();

  const handleUploadAvatar = async (file: File) => {
    if (!professional) return;

    try {
      const imageBase64 = await readFileAsBase64(file);

      await uploadImage({
        id: professional._id,
        imageBase64,
        fileName: file.name,
        mimeType: file.type,
      });

      await queryClient.invalidateQueries({
        queryKey: [GET_HEALTH_PROFESSIONALS_BY_USER_ID, professional._id],
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const sidebarItems =
    user?.healthProfessionalType === healthProfessionalType.EXAM_PROFESSIONAL
      ? SIDEBAR_EXAM_PROFESSIONAL_MANAGER
      : SIDEBAR_PROFESSIONAL_MANAGER;

  return (
    <div className={style.container}>
      <SideBar items={sidebarItems} pageTitle="Painel de Gestão" user={user} />
      <div className={style.mainContent}>
        <HeaderManager
          title="Meu Perfil"
          subtitle="Gerencie suas informações profissionais"
          onButtonClick={() => {}}
          user={user}
        />

        {professional && (
          <div className={style.content}>
            <AvatarUpload
              name={professional.name}
              avatarUrl={professional.avatar}
              isUploading={isUploading}
              onUpload={handleUploadAvatar}
            />

            <ProfileForm professional={professional} />
          </div>
        )}
      </div>
    </div>
  );
}

export { ProfessionalProfile };
