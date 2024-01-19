import { Module } from '@nestjs/common';
import { CreditManagerService } from './credit-manager.service';
import { CreditManagerCore } from './credit-manager.core';

@Module({
  providers: [CreditManagerService, CreditManagerCore],
  exports: [CreditManagerService],
})
export class CreditManagerModule {}
