import { Module } from '@nestjs/common';
import { CreditManagerService } from './credit-manager.service';
import { CreditManagerCalculationCore } from './credit-manager-calculation.core';
import { CreditManagerCheckingCore } from './credit-manager-checking.core';

@Module({
  providers: [
    CreditManagerService,
    CreditManagerCalculationCore,
    CreditManagerCheckingCore,
  ],
  exports: [CreditManagerService],
})
export class CreditManagerModule {}
