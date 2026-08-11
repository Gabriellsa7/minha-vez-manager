import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Field } from '../../../../components/field/field';
import { useCurrentUser } from '../../../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../../../config/api/get-health-units-by-user-id';
import { useGetPatientByCpf } from '../../../../config/api/get-patient-by-cpf';
import { GET_EXAMS_BY_HEALTH_UNIT_ID_KEY } from '../../../../config/api/get-exams-by-health-unit-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { formatCpf } from '../../../../config/utils';
import { usePostExam } from '../../api/post-exam';
import {
  examRegistrationFormSchema,
  type ExamRegistrationFormData,
} from './entities/exam-registration-form.schema';
import style from './exam-registration-form.module.scss';

const ALLOWED_MIME_TYPE = 'application/pdf';

const defaultValues: ExamRegistrationFormData = {
  healthUnitId: '',
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

function ExamRegistrationForm() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { data: healthUnits, isLoading: isLoadingUnits } =
    useHealthUnitsByUserId(currentUser?._id);

  const [cpfInput, setCpfInput] = useState('');
  const [confirmedCpf, setConfirmedCpf] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    data: patient,
    isFetching: isSearchingPatient,
    isError: patientNotFound,
    refetch: searchPatient,
  } = useGetPatientByCpf(cpfInput);

  const { mutateAsync, isPending } = usePostExam();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExamRegistrationFormData>({
    resolver: zodResolver(examRegistrationFormSchema),
    defaultValues,
  });

  const hasSingleHealthUnit = healthUnits?.length === 1;

  useEffect(() => {
    if (hasSingleHealthUnit && healthUnits) {
      setValue('healthUnitId', healthUnits[0]._id);
    }
  }, [hasSingleHealthUnit, healthUnits, setValue]);

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

    setSelectedFile(file);
  };

  const resetForm = () => {
    reset(defaultValues);
    setCpfInput('');
    setConfirmedCpf(null);
    setSelectedFile(null);
  };

  const onSubmit = async (data: ExamRegistrationFormData) => {
    if (!confirmedCpf) {
      toast.error('Busque e confirme o paciente pelo CPF antes de continuar.');
      return;
    }

    if (!selectedFile) {
      toast.error('Selecione o arquivo PDF do exame.');
      return;
    }

    try {
      const fileBase64 = await readFileAsBase64(selectedFile);

      await mutateAsync({
        patientCpf: confirmedCpf,
        healthUnitId: data.healthUnitId,
        examType: data.examType,
        examDate: data.examDate || undefined,
        doctorName: data.doctorName || undefined,
        notes: data.notes || undefined,
        fileBase64,
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
      });

      await queryClient.invalidateQueries({
        queryKey: [GET_EXAMS_BY_HEALTH_UNIT_ID_KEY, data.healthUnitId],
      });

      toast.success('Exame cadastrado com sucesso.');
      resetForm();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className={style.container}>
      <h2>Cadastrar exame</h2>

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
          {healthUnits && healthUnits.length > 1 && (
            <Field
              label="Unidade de saúde"
              error={errors.healthUnitId?.message}
            >
              <select {...register('healthUnitId')} disabled={isLoadingUnits}>
                <option value="">Selecione uma unidade</option>
                {healthUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
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

          <button
            type="submit"
            className={style.submitButton}
            disabled={isPending}
          >
            {isPending ? 'Cadastrando...' : 'Cadastrar exame'}
          </button>
        </form>
      )}
    </div>
  );
}

export { ExamRegistrationForm };
