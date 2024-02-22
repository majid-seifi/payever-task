import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  imports: [HttpModule, AvatarModule],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
