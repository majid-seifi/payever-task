import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { map, catchError, lastValueFrom } from 'rxjs';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AvatarService } from '../avatar/avatar.service';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpService,
    private readonly avatarService: AvatarService,
  ) {}

  async getUserById(id: string): Promise<any> {
    return this.http
      .get(`https://reqres.in/api/users/${id}`)
      .pipe(map((res) => res.data.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  async saveAvatar(id: string): Promise<any> {
    return this.getUserById(id).then((res: any) => {
      return lastValueFrom(res).then(async (user: User) => {
        const hash = randomStringGenerator();
        const writer = fs.createWriteStream(`./avatars/${hash}`);

        const response = await this.http.axiosRef({
          url: user.avatar,
          method: 'GET',
          responseType: 'stream',
        });

        response.data.pipe(writer);

        return this.avatarService.create({ userId: +id, hash });
      });
    });
  }

  async showAvatar(hash: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./avatars/${hash}`, { encoding: 'base64' }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  removeAvatar(hash: string) {
    fs.unlink(`./avatars/${hash}`, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });
  }
}
