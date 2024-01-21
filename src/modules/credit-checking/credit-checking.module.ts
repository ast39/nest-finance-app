import { Module } from '@nestjs/common';
import { CreditCheckingController } from './credit-checking.controller';
import { CreditCheckingService } from './credit-checking.service';
import { CreditCheckingRepository } from './credit-checking.repository';
import { CreditManagerModule } from '../credit-manager/credit-manager.module';

@Module({
  imports: [CreditManagerModule],
  controllers: [CreditCheckingController],
  providers: [CreditCheckingService, CreditCheckingRepository],
})
export class CreditCheckingModule {}
