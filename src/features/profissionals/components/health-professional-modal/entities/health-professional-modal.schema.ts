import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const healthProfessionalModalSchema = z
  .object({
    healthUnitId: requiredText('Selecione a unidade de saúde.'),
    name: requiredText('Informe o nome do profissional.'),
    email: z.email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string(),
    specialty: requiredText('Informe a especialidade.'),
    professionalLicense: requiredText('Informe o registro profissional.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

export type HealthProfessionalModalFormData = z.infer<
  typeof healthProfessionalModalSchema
>;
