import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({
    message: 'E-mail inválido',
  }),

  password: z.string().min(1, {
    message: 'Informe a senha',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
