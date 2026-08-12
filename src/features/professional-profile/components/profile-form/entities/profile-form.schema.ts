import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const profileFormSchema = z.object({
  name: requiredText('Informe seu nome.'),
  specialty: requiredText('Informe sua especialidade.'),
  room: requiredText('Informe sua sala de atendimento.'),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
