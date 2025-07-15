import { z } from 'zod';

export const authCredentialsSchema = z.object({
  cpf: z
    .string()
    .length(11, { message: 'CPF deve conter exatamente 11 dígitos' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .regex(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
      'Token inválido: formato JWT esperado',
    ),
});
