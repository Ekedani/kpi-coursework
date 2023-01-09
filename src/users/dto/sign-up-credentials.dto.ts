import { IsEmail, Length, MaxLength } from 'class-validator';

export class SignUpCredentialsDto {
  @Length(2, 64, {
    message: 'First name length must be from 2 to 64 chars',
  })
  readonly firstName: string;

  @Length(2, 64, {
    message: 'Last name length must be from 2 to 64 chars',
  })
  readonly lastName: string;

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
