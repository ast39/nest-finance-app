import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CreditCalculationModule } from './modules/credit-calculation/credit-calculation.module';
import { CreditManagerModule } from './modules/credit-manager/credit-manager.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'modules/static'),
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    CreditCalculationModule,
    CreditManagerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
