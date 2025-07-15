import { Request } from 'express';
import { UserType } from 'generated/prisma';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  userId: number;
  userType?: UserType;
};

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
