import { UserType } from '../../generated/prisma';
import { z } from 'zod';

const createStudentSchema = z.object({
  userType: z.literal(UserType.STUDENT),
  cpf: z
    .string()
    .length(11, { message: 'CPF deve conter exatamente 11 dígitos' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  enrollment: z
    .string()
    .min(1, { message: 'Enrollment é obrigatório para usuário de tipo estudante(type=0)' })
    .max(100, { message: 'Enrollment deve ter no máximo 100 caracteres' }),
  course: z
    .string()
    .min(1, { message: 'Course é obrigatório para usuário de tipo estudante(type=0)' })
    .max(100, { message: 'Course deve ter no máximo 100 caracteres' }),
});

const createTeacherSchema = z.object({
  userType: z.literal(UserType.TEACHER),
  cpf: z
    .string()
    .length(11, { message: 'CPF deve conter exatamente 11 dígitos' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

export const createUserSchema = z.discriminatedUnion('userType', [
  createStudentSchema,
  createTeacherSchema,
]);
