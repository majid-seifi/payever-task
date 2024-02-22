import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';

import { MailModule } from '../mail/mail.module';
import { ApiModule } from '../api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarModule } from '../avatar/avatar.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MailModule,
    ApiModule,
    AvatarModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URL,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
