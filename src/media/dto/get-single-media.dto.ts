import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetSingleMediaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly kinopoiskId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly tmdbId: string;
}
