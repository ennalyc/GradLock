import { UserType } from '../../generated/prisma';

export type UserRequest = {
  cpf: string;
  enrollment?: string | null;
  course?: string | null;
  name: string;
  password: string;
  userType: UserType;
};

export type UserAuth = {
  cpf: string;
  password: string;
};

export type User = {
  id: number;
  cpf: string;
  name: string;
  enrollment?: string | null;
  course?: string | null;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
};
