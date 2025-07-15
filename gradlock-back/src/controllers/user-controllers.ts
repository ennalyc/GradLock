import userService from '../services/user-service';
import { NextFunction, Request, Response } from 'express';

const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;

      const newUser = await userService.createUser({
        ...user,
      });
      res.status(201).json({ ...newUser, success: true });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
