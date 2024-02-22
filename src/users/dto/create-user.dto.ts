import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  username: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
