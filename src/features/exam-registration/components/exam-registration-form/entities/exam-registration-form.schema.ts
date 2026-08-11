import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const examRegistrationFormSchema = z.object({
  healthUnitId: requiredText('Selecione a unidade de saúde.'),
  examType: requiredText('Informe o tipo de exame.'),
  examDate: z.string().trim(),
  doctorName: z.string().trim(),
  notes: z.string().trim(),
});

export type ExamRegistrationFormData = z.infer<
  typeof examRegistrationFormSchema
>;
