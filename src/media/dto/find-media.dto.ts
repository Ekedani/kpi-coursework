import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FindMediaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly keyword: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Transform(({ value }) => Number.parseInt(value))
  readonly ratingFrom: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Transform(({ value }) => Number.parseInt(value))
  readonly ratingTo: number;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(3000)
  @Transform(({ value }) => Number.parseInt(value))
  readonly yearFrom: number;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(3000)
  @Transform(({ value }) => Number.parseInt(value))
  readonly yearTo: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  readonly page: number;
}
