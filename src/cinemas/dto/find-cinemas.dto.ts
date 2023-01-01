import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindCinemasDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  readonly page: number;
}
