import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';
import { useUploadHealthProfessionalImage } from '../../config/api/upload-health-professional-image';
import { handleApiError } from '../../config/utils/handle-api-error';
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
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className={style.mainContent}>
      <HeaderManager
        title="Meu Perfil"
        subtitle="Gerencie suas informações profissionais"
        user={user}
      />

      {professional && (
        <div className={style.page}>
          <div className={style.content}>
            <AvatarUpload
              name={professional.name}
              avatarUrl={professional.avatar}
              isUploading={isUploading}
              onUpload={handleUploadAvatar}
            />

            <ProfileForm professional={professional} />
          </div>
        </div>
      )}
    </div>
  );
}

export { ProfessionalProfile };
