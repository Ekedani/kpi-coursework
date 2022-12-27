import { IsEmail, Length, MaxLength } from 'class-validator';

export class SignInCredentialsDto {
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  @MaxLength(64, {
    message: 'Email length must be up to 64 chars',
  })
  readonly email: string;

  @Length(8, 128, {
    message: 'Password length must be from 8 to 128 chars',
  })
  readonly password: string;
}
