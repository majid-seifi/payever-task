import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { AvatarModule } from '../avatar/avatar.module';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { User } from '../users/entities/user.entity';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL),
        AvatarModule,
        HttpModule,
      ],
      providers: [ApiService],
    }).compile();

    service = module.get<ApiService>(ApiService);
  }, 20000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserById', () => {
    it('get user by id', async () => {
      const userId = randomInt(1, 12);
      const user = await service.getUserById(userId.toString());
      lastValueFrom(user).then((userEntity: User) => {
        expect(userEntity).toBeDefined();
        expect(userEntity.first_name).toBeDefined();
        expect(userEntity.last_name).toBeDefined();
        expect(userEntity.avatar).toBeDefined();
      });
    });
  });
  describe('saveAvatar', () => {
    it('saving the avatar', async () => {
      const userId = randomInt(1, 12);
      const avatar = await service.saveAvatar(userId.toString());
      expect(avatar).toBeDefined();
      expect(avatar.userId).toEqual(userId);
      expect(avatar.hash).toHaveLength(21);
    });
  });
  describe('showAvatar', () => {
    it('show the avatar', async () => {
      const userId = randomInt(1, 12);
      const avatar = await service.saveAvatar(userId.toString());
      const avatarFile = await service.showAvatar(avatar.hash);
      expect(avatarFile).toBeDefined();
    }, 20000);
  });
});
