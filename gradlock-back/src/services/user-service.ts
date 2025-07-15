import bcrypt from 'bcrypt';
import prisma from '../config/prismaClient';
import { AlreadyExistsError } from '../errors/httpErrors';
import { User, UserRequest } from '../types/user';
import { securityConfig } from '../config/baseConfig';

const userService = {
  async createUser(user: UserRequest): Promise<User> {
    const clause = user.enrollment
      ? {
          OR: [{ cpf: user.cpf }, { enrollment: user.enrollment }],
        }
      : { cpf: user.cpf };
    const selectFilter = {
      id: true,
      name: true,
      cpf: true,
      enrollment: true,
      course: true,
      userType: true,
      createdAt: true,
      updatedAt: true,
    };
    let existentUser = await prisma.user.findFirst({
      where: clause,
      select: selectFilter,
    });

    if (existentUser !== null) {
      const parts: string[] = [];

      if (existentUser.cpf === user.cpf) {
        parts.push(`cpf ${user.cpf}`);
      }

      if (user.enrollment && existentUser.enrollment === user.enrollment) {
        parts.push(`enrollment ${user.enrollment}`);
      }

      const message = `User with ${parts.join(' and ')} already exists`;
      throw new AlreadyExistsError(message);
    }

    if (user.enrollment) {
      existentUser = await prisma.user.findUnique({
        where: { enrollment: user.enrollment },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: await bcrypt.hash(user.password, securityConfig.saltRounds),
      },
      select: selectFilter,
    });

    return newUser;
  },
};

export default userService;
