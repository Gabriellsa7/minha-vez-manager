import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { getUserInitials } from '../../../../config/utils';
import style from './avatar-upload.module.scss';

interface AvatarUploadProps {
  name: string;
  avatarUrl?: string;
  isUploading?: boolean;
  onUpload: (file: File) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function AvatarUpload({
  name,
  avatarUrl,
  isUploading,
  onUpload,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > MAX_FILE_SIZE_BYTES) return;

    onUpload(file);
  };

  return (
    <div className={style.container}>
      <button
        type="button"
        className={style.avatarButton}
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label="Alterar foto de perfil"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={style.avatarImage} />
        ) : (
          <span className={style.initials}>{getUserInitials(name)}</span>
        )}

        <span className={style.overlay}>
          <Camera size={18} />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={style.hiddenInput}
        onChange={handleFileChange}
      />

      <span className={style.hint}>
        {isUploading ? 'Enviando foto...' : 'Clique para alterar a foto'}
      </span>
    </div>
  );
}

export { AvatarUpload };
