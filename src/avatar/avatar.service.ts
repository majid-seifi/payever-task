import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvatarDocument } from '../schemas/avatar.schema';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private readonly avatarModel: Model<AvatarDocument>,
  ) {}

  async create(createAvatarDto: CreateAvatarDto) {
    const avatar = new this.avatarModel(createAvatarDto);
    return avatar.save();
  }

  async findOne(userId: number): Promise<AvatarDocument> {
    return this.avatarModel.findOne({ userId });
  }

  async findByHash(hash: string): Promise<AvatarDocument> {
    return this.avatarModel.findOne({ hash });
  }

  async remove(userId: number) {
    return this.avatarModel.deleteOne({ userId });
  }

  async removeByHash(hash: string) {
    return this.avatarModel.deleteOne({ hash });
  }
}
