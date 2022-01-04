import { StorageModule } from './../storage/storage.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [],
  providers: [UserResolver, UserService],
  exports: [],
})
export class UserModule {}
