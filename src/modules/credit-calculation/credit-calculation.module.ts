import { Module } from '@nestjs/common';
import { CreditCalculationController } from './credit-calculation.controller';
import { CreditCalculationService } from './credit-calculation.service';
import { CreditCalculationRepository } from './credit-calculation.repository';

@Module({
  controllers: [CreditCalculationController],
  providers: [CreditCalculationService, CreditCalculationRepository],
})
export class CreditCalculationModule {}
