import { z } from 'zod';
import { patientPriority } from '../../../../../config/entities/patient/patient.entity';
import {
  isValidBirthDate,
  isValidPhone,
} from '../../../../../config/utils/patient-input';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const patientRegistrationModalSchema = z.object({
  name: requiredText('Informe o nome do paciente.'),
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  birthDate: requiredText('Informe a data de nascimento.').refine(
    isValidBirthDate,
    'Data de nascimento inválida.'
  ),
  phone: requiredText('Informe o telefone.').refine(
    isValidPhone,
    'Telefone inválido.'
  ),
  priority: z.enum([
    patientPriority.NORMAL,
    patientPriority.PREGNANT,
    patientPriority.DISABLED,
    patientPriority.CHRONIC_CONDITION,
  ]),
});

export type PatientRegistrationModalFormData = z.infer<
  typeof patientRegistrationModalSchema
>;
