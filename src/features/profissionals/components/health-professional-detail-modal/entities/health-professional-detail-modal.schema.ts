import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const healthProfessionalDetailModalSchema = z.object({
  name: requiredText('Informe o nome do profissional.'),
  specialty: requiredText('Informe a especialidade.'),
  professionalLicense: requiredText('Informe o registro profissional.'),
  room: requiredText('Informe a sala do profissional.').regex(
    /^\d{1,4}$/,
    'Informe um número de sala válido (até 9999).'
  ),
  schedule: z.object({
    appointmentDuration: z
      .number()
      .min(10, 'A duração mínima é 10 minutos.'),

    morning: z.object({
      start: requiredText('Informe o horário inicial da manhã.'),
      end: requiredText('Informe o horário final da manhã.'),
    }),

    afternoon: z.object({
      start: requiredText('Informe o horário inicial da tarde.'),
      end: requiredText('Informe o horário final da tarde.'),
    }),
  }),
});

export type HealthProfessionalDetailModalFormData = z.infer<
  typeof healthProfessionalDetailModalSchema
>;
