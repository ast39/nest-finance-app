import { Module } from '@nestjs/common';
import { CreditManagerService } from './credit-manager.service';

@Module({
  providers: [CreditManagerService],
  exports: [CreditManagerService],
})
export class CreditManagerModule {}
