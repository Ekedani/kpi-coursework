import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCinemaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  readonly name: string;

  @IsString()
  @MaxLength(1000)
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  readonly link: string;
}
