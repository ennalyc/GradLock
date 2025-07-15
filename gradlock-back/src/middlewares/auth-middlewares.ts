import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types/auth';
import { NextFunction, Response } from 'express';
import { ForbiddenError, InvalidCredentialsError } from '../errors/httpErrors';
import { securityConfig } from '../config/baseConfig';
import { UserType } from 'generated/prisma';

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const [, accessToken] = req.headers.authorization?.split(' ') ?? [];

  if (!accessToken) {
    next(new InvalidCredentialsError('accessToken faltando.'));
  }

  try {
    req.user = jwt.verify(accessToken, securityConfig.jwtSecret) as JwtPayload;
    next();
  } catch {
    next(new InvalidCredentialsError('Credenciais inválidas.'));
  }
};

export const authorization =
  (userType: UserType) => (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (req.user?.userType !== UserType.ADMIN && req.user?.userType !== userType) {
      next(new ForbiddenError('Acesso negado.'));
    }

    next();
  };
