import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindUsersDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  readonly page: number;
}
