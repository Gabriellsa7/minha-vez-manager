import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  GET_PATIENT_BY_CPF_KEY,
  useGetPatientByCpf,
} from '../../../../../config/api/get-patient-by-cpf';
import { formatCpf } from '../../../../../config/utils';
import { handleApiError } from '../../../../../config/utils/handle-api-error';
import { isValidCpf } from '../../../../../config/utils/patient-input';
import type { IPatient } from '../../../../../config/entities/patient/patient.entity';
import { isNotFoundError } from '../../../../../services/react-query';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

export function usePatientLookup() {
  const queryClient = useQueryClient();
  const [cpf, setCpfValue] = useState('');
  const [searchedCpf, setSearchedCpf] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const {
    data: patient,
    error,
    isFetching: isSearching,
    refetch,
  } = useGetPatientByCpf(searchedCpf, { enabled: Boolean(searchedCpf) });

  const isNotFound = isNotFoundError(error);

  useEffect(() => {
    if (error && !isNotFound) handleApiError(error);
  }, [error, isNotFound]);

  const setCpf = (value: string) => {
    setCpfValue(formatCpf(value));
    setSearchedCpf('');
  };

  const search = () => {
    const normalizedCpf = onlyDigits(cpf);

    if (!isValidCpf(normalizedCpf)) {
      toast.error('Informe um CPF válido.');
      return;
    }

    if (normalizedCpf === searchedCpf) {
      void refetch();
      return;
    }

    setSearchedCpf(normalizedCpf);
  };

  const handleRegistered = (newPatient: IPatient) => {
    const normalizedCpf = onlyDigits(cpf);
    queryClient.setQueryData(
      [GET_PATIENT_BY_CPF_KEY, normalizedCpf],
      newPatient
    );
    setSearchedCpf(normalizedCpf);
    setShowRegistrationModal(false);
  };

  const reset = () => {
    setCpfValue('');
    setSearchedCpf('');
    setShowRegistrationModal(false);
  };

  const currentPatient = searchedCpf ? (patient ?? null) : null;

  return {
    cpf,
    setCpf,
    search,
    isSearching,
    patient: currentPatient,
    patientNotFound: Boolean(searchedCpf) && !isSearching && isNotFound,
    showRegistrationModal,
    setShowRegistrationModal,
    handleRegistered,
    reset,
  };
}

export type UsePatientLookupReturn = ReturnType<typeof usePatientLookup>;
