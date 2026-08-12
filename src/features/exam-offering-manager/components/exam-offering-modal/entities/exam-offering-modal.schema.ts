import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const examOfferingModalSchema = z
  .object({
    name: requiredText('Informe o nome do exame.'),
    code: z.string().trim(),
    description: z.string().trim(),
    category: z.string().trim(),
    sampleType: z.string().trim(),
    durationMinutes: z
      .number()
      .int()
      .positive('Informe a duração em minutos.'),
    resultTurnaroundEstimate: z.string().trim(),
    requiresPreparation: z.boolean(),
    preparationInstructions: z.string().trim(),
    requiresFasting: z.boolean(),
    fastingHours: z.number().min(0).optional(),
    price: z.number().min(0, 'Informe um preço válido.').optional(),
    acceptedInsurances: z.string().trim(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => !data.requiresPreparation || data.preparationInstructions,
    {
      message: 'Informe as orientações de preparo.',
      path: ['preparationInstructions'],
    }
  );

export type ExamOfferingModalFormData = z.infer<typeof examOfferingModalSchema>;
