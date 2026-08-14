import { z } from 'zod';

const requiredText = (message: string) => z.string().trim().min(1, message);

export const examProfessionalUploadFormSchema = z.object({
  examType: requiredText('Informe o tipo de exame.'),
  examDate: z.string().trim(),
  doctorName: z.string().trim(),
  notes: z.string().trim(),
});

export type ExamProfessionalUploadFormData = z.infer<
  typeof examProfessionalUploadFormSchema
>;
