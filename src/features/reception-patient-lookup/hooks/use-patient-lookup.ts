import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  useGetPatientByCpf,
  GET_PATIENT_BY_CPF_KEY,
} from '../../../config/api/get-patient-by-cpf';
import { formatCpf } from '../../../config/utils';
import { isValidCpf } from '../../../config/utils/patient-input';
import type { IPatient } from '../../../config/entities/patient/patient.entity';

export function usePatientLookup() {
  const queryClient = useQueryClient();
  const [cpf, setCpfRaw] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const normalizedCpf = cpf.replace(/\D/g, '');

  const {
    data: patient,
    isFetching: isSearching,
    refetch,
  } = useGetPatientByCpf(normalizedCpf);

  const setCpf = (value: string) => {
    setCpfRaw(formatCpf(value));
    setHasSearched(false);
  };

  const search = async () => {
    if (!isValidCpf(normalizedCpf)) {
      toast.error('Informe um CPF válido.');
      return;
    }

    await refetch();
    setHasSearched(true);
  };

  const handleRegistered = (newPatient: IPatient) => {
    queryClient.setQueryData(
      [GET_PATIENT_BY_CPF_KEY, normalizedCpf],
      newPatient
    );
    setShowRegistrationModal(false);
  };

  const reset = () => {
    setCpfRaw('');
    setHasSearched(false);
    setShowRegistrationModal(false);
  };

  const patientNotFound = hasSearched && !isSearching && !patient;

  return {
    cpf,
    setCpf,
    search,
    isSearching,
    patient: patient ?? null,
    patientNotFound,
    showRegistrationModal,
    setShowRegistrationModal,
    handleRegistered,
    reset,
  };
}

export type UsePatientLookupReturn = ReturnType<typeof usePatientLookup>;
