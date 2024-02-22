import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from '../schemas/avatar.schema';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Avatar as AvatarEntity } from './entities/avatar.entity';
import { randomInt } from 'crypto';

describe('AvatarService', () => {
  let service: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([
          {
            name: Avatar.name,
            schema: AvatarSchema,
          },
        ]),
      ],
      providers: [AvatarService],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create avatar', async () => {
      const userId = randomInt(1, 12);
      const hash = randomStringGenerator();
      const avatar: AvatarEntity = await service.create({
        userId,
        hash,
      });
      expect(avatar.userId).toEqual(userId);
      expect(avatar.hash).toHaveLength(21);
      expect(avatar.hash).toEqual(hash);
    });
  });

  describe('findOne', () => {
    it('find avatar', async () => {
      const userId = randomInt(1, 12);
      const hash = randomStringGenerator();
      await service.create({
        userId,
        hash,
      });
      const avatar: AvatarEntity = await service.findOne(userId);
      expect(avatar.userId).toEqual(userId);
      expect(avatar.hash).toHaveLength(21);
    });
  });

  describe('findByHash', () => {
    it('find avatar by hash', async () => {
      const userId = randomInt(1, 12);
      const hash = randomStringGenerator();
      await service.create({
        userId,
        hash,
      });
      const avatar: AvatarEntity = await service.findByHash(hash);
      expect(avatar.userId).toEqual(userId);
      expect(avatar.hash).toHaveLength(21);
      expect(avatar.hash).toEqual(hash);
    });
  });

  describe('remove', () => {
    it('remove avatar', async () => {
      const userId = randomInt(1, 12);
      const hash = randomStringGenerator();
      await service.create({
        userId,
        hash,
      });
      await service.removeByHash(hash);
      const avatar: AvatarEntity = await service.findByHash(hash);
      expect(avatar).toBeNull();
    });
  });

  describe('removeByHash', () => {
    it('remove avatar by hash', async () => {
      const userId = randomInt(1, 12);
      const hash = randomStringGenerator();
      await service.create({
        userId,
        hash,
      });
      await service.removeByHash(hash);
      const avatar: AvatarEntity = await service.findByHash(hash);
      expect(avatar).toBeNull();
    });
  });
});
