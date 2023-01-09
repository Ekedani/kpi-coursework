import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateCinemaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(128)
  readonly link: string;
}
