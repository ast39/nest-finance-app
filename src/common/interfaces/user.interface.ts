import { Prisma, User } from '@prisma/client';

export interface IUser extends User {}

export type IUserCreate = Prisma.UserCreateInput;
export type IUserUpdate = Prisma.UserUpdateInput;
export type IUserFilter = Prisma.UserWhereInput;
export type IUserUnique = Prisma.UserWhereUniqueInput;
export type IUserOrder = Prisma.UserOrderByWithRelationInput;
