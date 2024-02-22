import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { MailModule } from '../mail/mail.module';
import { ApiModule } from '../api/api.module';
import { AvatarModule } from '../avatar/avatar.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

describe('UsersService', () => {
  let service: UsersService;

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
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('create user', async () => {
      // create user
      const userValues = {
        first_name: randomStringGenerator(),
        last_name: randomStringGenerator(),
        email: `${randomStringGenerator()}@test.com`,
        username: randomStringGenerator(),
      };
      const user: any = await service.create(userValues);
      expect(user.id).toBeDefined();
      expect(user.first_name).toEqual(userValues.first_name);
      expect(user.last_name).toEqual(userValues.last_name);
      expect(user.email).toEqual(userValues.email);
      expect(user.username).toEqual(userValues.username);
      expect(user.created).toBeDefined();
      expect(user.updated).toBeDefined();
    });
  });
});
