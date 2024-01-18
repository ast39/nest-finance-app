import { Prisma, CreditCalculation } from '@prisma/client';

export interface ICalculation extends CreditCalculation {}

export type ICalculationCreate = Prisma.CreditCalculationCreateInput;
export type ICalculationUpdate = Prisma.CreditCalculationUpdateInput;
export type ICalculationFilter = Prisma.CreditCalculationWhereInput;
export type ICalculationUnique = Prisma.CreditCalculationWhereUniqueInput;
export type ICalculationOrder = Prisma.CreditCalculationOrderByWithRelationInput;
