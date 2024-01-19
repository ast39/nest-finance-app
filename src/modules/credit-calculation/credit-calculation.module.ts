import { Module } from '@nestjs/common';
import { CreditCalculationController } from './credit-calculation.controller';
import { CreditCalculationService } from './credit-calculation.service';
import { CreditCalculationRepository } from './credit-calculation.repository';
import { CreditManagerModule } from '../credit-manager/credit-manager.module';

@Module({
  imports: [CreditManagerModule],
  controllers: [CreditCalculationController],
  providers: [CreditCalculationService, CreditCalculationRepository],
})
export class CreditCalculationModule {}
