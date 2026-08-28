import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const receptionistModalSchema = z
  .object({
    healthUnitId: requiredText('Selecione a unidade de saúde.'),
    name: requiredText('Informe o nome da recepcionista.'),
    email: z.email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

export type ReceptionistModalFormData = z.infer<typeof receptionistModalSchema>;
