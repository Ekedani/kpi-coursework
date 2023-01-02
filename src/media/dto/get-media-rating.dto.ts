import { GetSingleMediaDto } from './get-single-media.dto';
import { PartialType } from '@nestjs/mapped-types';

export class GetMediaRatingDto extends PartialType(GetSingleMediaDto) {}
