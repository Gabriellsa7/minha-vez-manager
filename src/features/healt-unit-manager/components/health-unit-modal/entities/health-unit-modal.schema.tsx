import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const healthUnitModalSchema = z.object({
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
  services: z
    .array(
      z.object({
        name: requiredText('Informe o nome do serviço.'),
        description: z.string().trim(),
        duration: z.number().int().positive('Informe a duração em minutos.'),
        price: z.number().min(0, 'Informe um preço válido.'),
      })
    )
    .min(1, 'Adicione pelo menos um serviço.'),
});

export type HealthUnitModalFormData = z.infer<typeof healthUnitModalSchema>;
