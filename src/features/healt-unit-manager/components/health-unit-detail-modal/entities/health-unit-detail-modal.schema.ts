import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const healthUnitDetailModalSchema = z.object({
  name: requiredText('Informe o nome da unidade.'),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Informe um telefone válido.'),
  email: z.email('Informe um e-mail válido.'),
  description: z.string().trim(),
  img: z
    .string()
    .trim()
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: 'Informe uma URL de imagem válida.',
    }),
  address: z.object({
    street: requiredText('Informe a rua.'),
    number: requiredText('Informe o número.'),
    complement: z.string().trim(),
    neighborhood: requiredText('Informe o bairro.'),
    city: requiredText('Informe a cidade.'),
    state: requiredText('Informe o estado.'),
    zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'Informe um CEP válido.'),
  }),
});

export type HealthUnitDetailModalFormData = z.infer<
  typeof healthUnitDetailModalSchema
>;
