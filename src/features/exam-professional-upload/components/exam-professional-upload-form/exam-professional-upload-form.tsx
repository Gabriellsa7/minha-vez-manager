import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { Field } from '../../../../components/field/field';
import { useCurrentUser } from '../../../../config/api/get-current-user';
import { useGetPatientByCpf } from '../../../../config/api/get-patient-by-cpf';
import { useGetExamBookingsByPatientId } from '../../../../config/api/get-exam-bookings-by-patient-id';
import { examBookingStatus } from '../../../../config/entities/exam-booking/exam-booking.entity';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { formatCpf } from '../../../../config/utils';
import { usePostExam } from '../../../exam-registration/api/post-exam';
import {
  examProfessionalUploadFormSchema,
  type ExamProfessionalUploadFormData,
} from './entities/exam-professional-upload-form.schema';
import style from './exam-professional-upload-form.module.scss';

const ALLOWED_MIME_TYPE = 'application/pdf';

const defaultValues: ExamProfessionalUploadFormData = {
  examType: '',
  examDate: '',
  doctorName: '',
  notes: '',
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ExamProfessionalUploadForm() {
  const { data: currentUser } = useCurrentUser();
  const healthUnitId = currentUser?.healthUnitId;

  const [cpfInput, setCpfInput] = useState('');
  const [confirmedCpf, setConfirmedCpf] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: patient,
    isFetching: isSearchingPatient,
    isError: patientNotFound,
    refetch: searchPatient,
  } = useGetPatientByCpf(cpfInput);

  const [selectedBookingId, setSelectedBookingId] = useState('');

  const { data: patientBookings } = useGetExamBookingsByPatientId(
    patient?._id,
    { enabled: Boolean(confirmedCpf && patient?._id) }
  );

  const linkableBookings = (patientBookings ?? []).filter(
    (booking) =>
      booking.status === examBookingStatus.COMPLETED && !booking.resultExamId
  );

  const { mutateAsync, isPending } = usePostExam();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamProfessionalUploadFormData>({
    resolver: zodResolver(examProfessionalUploadFormSchema),
    defaultValues,
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSearchPatient = async () => {
    if (!cpfInput.trim()) return;
    const result = await searchPatient();
    setConfirmedCpf(result.data ? cpfInput : null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.type !== ALLOWED_MIME_TYPE) {
      toast.error('Envie um arquivo em formato PDF.');
      event.target.value = '';
      setSelectedFile(null);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    reset(defaultValues);
    setCpfInput('');
    setConfirmedCpf(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedBookingId('');
  };

  const onSubmit = async (data: ExamProfessionalUploadFormData) => {
    if (!confirmedCpf) {
      toast.error('Busque e confirme o paciente pelo CPF antes de continuar.');
      return;
    }

    if (!selectedFile) {
      toast.error('Selecione o arquivo PDF do exame.');
      return;
    }

    if (!healthUnitId) {
      toast.error('Não foi possível identificar sua unidade de saúde.');
      return;
    }

    try {
      const fileBase64 = await readFileAsBase64(selectedFile);

      await mutateAsync({
        patientCpf: confirmedCpf,
        healthUnitId,
        examType: data.examType,
        examDate: data.examDate || undefined,
        doctorName: data.doctorName || undefined,
        notes: data.notes || undefined,
        fileBase64,
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        examBookingId: selectedBookingId || undefined,
      });

      toast.success(
        'Exame enviado com sucesso. O admin da unidade foi notificado por e-mail.'
      );
      resetForm();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className={style.container}>
      <h2>Enviar resultado de exame</h2>

      <div className={style.cpfSearch}>
        <Field label="CPF do paciente">
          <input
            value={cpfInput}
            onChange={(event) => {
              setCpfInput(formatCpf(event.target.value));
              setConfirmedCpf(null);
            }}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </Field>
        <button
          type="button"
          className={style.searchButton}
          onClick={handleSearchPatient}
          disabled={isSearchingPatient || !cpfInput.trim()}
        >
          <Search size={16} />
          {isSearchingPatient ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {confirmedCpf && patient && (
        <p className={style.patientFound}>
          Paciente encontrado — CPF <strong>{patient.cpf}</strong>
          {patient.phone && <> · Telefone {patient.phone}</>}
        </p>
      )}

      {!confirmedCpf && patientNotFound && (
        <p className={style.patientNotFound}>
          Nenhum paciente encontrado com este CPF.
        </p>
      )}

      {confirmedCpf && (
        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          {linkableBookings.length > 0 && (
            <Field label="Vincular a um agendamento (opcional)">
              <select
                value={selectedBookingId}
                onChange={(event) => setSelectedBookingId(event.target.value)}
              >
                <option value="">Não vincular</option>
                {linkableBookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.examOfferingName} —{' '}
                    {new Date(booking.scheduledAt).toLocaleDateString(
                      'pt-BR',
                      { timeZone: 'UTC' }
                    )}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Tipo de exame" error={errors.examType?.message}>
            <input
              {...register('examType')}
              list="exam-type-suggestions"
              placeholder="Ex.: Hemograma completo"
            />
            <datalist id="exam-type-suggestions">
              <option value="Hemograma completo" />
              <option value="Raio-X" />
              <option value="Ressonância magnética" />
              <option value="Ultrassonografia" />
              <option value="Eletrocardiograma" />
              <option value="Tomografia computadorizada" />
            </datalist>
          </Field>

          <div className={style.twoColumns}>
            <Field
              label="Data de realização (opcional)"
              error={errors.examDate?.message}
            >
              <input type="date" {...register('examDate')} />
            </Field>
            <Field
              label="Nome do médico (opcional)"
              error={errors.doctorName?.message}
            >
              <input {...register('doctorName')} placeholder="Dr(a). ..." />
            </Field>
          </div>

          <Field label="Observações (opcional)" error={errors.notes?.message}>
            <textarea {...register('notes')} rows={3} />
          </Field>

          <Field label="Arquivo PDF do exame">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Field>

          {previewUrl && (
            <div className={style.previewSection}>
              <span className={style.previewLabel}>
                Pré-visualização do exame
              </span>
              <iframe
                src={previewUrl}
                title="Pré-visualização do exame"
                className={style.previewViewer}
              />
            </div>
          )}

          <button
            type="submit"
            className={style.submitButton}
            disabled={isPending}
          >
            {isPending ? 'Enviando...' : 'Confirmar e notificar admin'}
          </button>
        </form>
      )}
    </div>
  );
}

export { ExamProfessionalUploadForm };
