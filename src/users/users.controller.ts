import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { ApiService } from '../api/api.service';
import { AvatarService } from '../avatar/avatar.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Controller(['users', 'user'])
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly apiService: ApiService,
    private readonly avatarService: AvatarService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    setImmediate(() => {
      try {
        this.mailService.sendUserConfirmation().then(() => {
          // if something need after send email
        });
        this.amqpConnection.publish('user', 'route', user).then(() => {
          // if something need after publish
        });
      } catch (e) {
        console.error(e);
      }
    });
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiService.getUserById(id);
  }

  @Get(':id/avatar')
  async avatar(@Param('id') id: string) {
    let avatar = await this.avatarService.findOne(+id);
    if (!avatar) {
      avatar = await this.apiService.saveAvatar(id);
    }

    return await this.apiService.showAvatar(avatar.hash);
  }

  @Delete(':id/avatar')
  async remove(@Param('id') id: string) {
    const avatar = await this.avatarService.findOne(+id);
    this.apiService.removeAvatar(avatar.hash);
    return this.avatarService.remove(+id);
  }
}
