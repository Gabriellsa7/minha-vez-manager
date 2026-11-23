import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const clinicAdminModalSchema = z
  .object({
    name: requiredText('Informe o nome do administrador da clínica.'),
    email: z.email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

export type ClinicAdminModalFormData = z.infer<typeof clinicAdminModalSchema>;
