import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  exports: [UserService],
})
export class UserModule {}
