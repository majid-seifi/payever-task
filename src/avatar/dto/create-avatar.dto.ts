import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsNotEmpty()
  userId: number;
  @IsString()
  @IsNotEmpty()
  hash: string;
}
