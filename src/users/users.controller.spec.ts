import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { MailModule } from '../mail/mail.module';
import { ApiModule } from '../api/api.module';
import { AvatarModule } from '../avatar/avatar.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true, // no need to import into other modules
        }),
        MongooseModule.forRoot(process.env.MONGODB_URL),
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
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
