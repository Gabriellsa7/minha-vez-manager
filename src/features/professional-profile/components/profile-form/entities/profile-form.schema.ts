import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const profileFormSchema = z.object({
  name: requiredText('Informe seu nome.'),
  specialty: requiredText('Informe sua especialidade.'),
  room: requiredText('Informe sua sala de atendimento.').regex(
    /^\d{1,4}$/,
    'Informe um número de sala válido (até 9999).',
  ),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
