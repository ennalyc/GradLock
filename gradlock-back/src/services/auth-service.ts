import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserType } from '../../generated/prisma';
import { securityConfig } from '../config/baseConfig';
import { JwtPayload } from '../types/auth';
import { UserAuth } from '../types/user';
import prisma from '../config/prismaClient';
import { InvalidCredentialsError, NotFoundError } from '../errors/httpErrors';
import { AuthTokens } from '../types/auth';

function generateAccessToken(userId: number, userType: UserType): string {
  const payload: JwtPayload = { userId: userId, userType: userType };
  const secretKey: string = securityConfig.jwtSecret;
  return jwt.sign(payload, secretKey, { expiresIn: '15m' });
}

function generateRefreshToken(userId: number): string {
  const payload: JwtPayload = { userId: userId };
  const secretKey: string = securityConfig.jwtSecret;
  return jwt.sign(payload, secretKey, { expiresIn: '7d' });
}

export const authService = {
  async login(user: UserAuth): Promise<AuthTokens> {
    const existentUser = await prisma.user.findUnique({
      where: { cpf: user.cpf },
      select: {
        id: true,
        password: true,
        userType: true,
      },
    });

    if (!existentUser) {
      throw new NotFoundError(`Usuário com cpf ${user.cpf} não encontrado.`);
    }

    const isPasswordCorrect = await bcrypt.compare(user.password, existentUser.password);

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Password inválido.');
    }

    return {
      accessToken: generateAccessToken(existentUser.id, existentUser.userType),
      refreshToken: generateRefreshToken(existentUser.id),
    };
  },
  async refresh({ refreshToken }: { refreshToken: string }): Promise<AuthTokens> {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, securityConfig.jwtSecret) as JwtPayload;
    } catch {
      throw new InvalidCredentialsError('refreshToken inválido.');
    }
    const existentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        userType: true,
      },
    });

    if (!existentUser) {
      throw new InvalidCredentialsError('refreshToken inválido.');
    }

    return {
      accessToken: generateAccessToken(decoded.userId, existentUser.userType),
      refreshToken: generateRefreshToken(decoded.userId),
    };
  },
};
