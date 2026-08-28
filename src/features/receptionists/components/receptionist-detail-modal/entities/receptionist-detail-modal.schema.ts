import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const receptionistDetailModalSchema = z.object({
  name: requiredText('Informe o nome da recepcionista.'),
  email: z.email('Informe um e-mail válido.'),
  active: z.boolean(),
});

export type ReceptionistDetailModalFormData = z.infer<
  typeof receptionistDetailModalSchema
>;
