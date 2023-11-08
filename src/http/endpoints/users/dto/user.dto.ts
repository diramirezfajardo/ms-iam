import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly password?: string;
}
