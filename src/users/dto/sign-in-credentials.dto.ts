import { IsString } from 'class-validator';

export class SignInCredentialsDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
