import { z } from 'zod';

const prescriptionExamSchema = z.object({
  examOfferingId: z.string().min(1, 'Selecione um exame'),
});

export const prescriptionFormSchema = z.object({
  medications: z.string().optional(),
  observations: z.string().optional(),
  exams: z.array(prescriptionExamSchema).min(1, 'Adicione ao menos um exame'),
});

export type PrescriptionFormData = z.infer<typeof prescriptionFormSchema>;
