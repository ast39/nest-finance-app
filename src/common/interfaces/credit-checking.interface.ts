import { Prisma, CreditChecking } from '@prisma/client';

export interface IChecking extends CreditChecking {}

export type ICheckingCreate = Prisma.CreditCheckingCreateInput;
export type ICheckingUpdate = Prisma.CreditCheckingUpdateInput;
export type ICheckingFilter = Prisma.CreditCheckingWhereInput;
export type ICheckingUnique = Prisma.CreditCheckingWhereUniqueInput;
export type ICheckingOrder = Prisma.CreditCheckingOrderByWithRelationInput;
