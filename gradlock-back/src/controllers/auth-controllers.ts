import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth-service';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const authTokens = await authService.login(req.body);
      res.status(200).json({ ...authTokens, success: true });
    } catch (error) {
      next(error);
    }
  },
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authTokens = await authService.refresh(req.body);
      res.status(200).json({ ...authTokens, success: true });
    } catch (error) {
      next(error);
    }
  },
};
