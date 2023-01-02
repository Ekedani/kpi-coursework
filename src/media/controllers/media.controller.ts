import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../../users/guards/api-key.guard';
import { AggregationService } from '../services/aggregation.service';
import { FindMediaDto } from '../dto/find-media.dto';
import { GetSingleMediaDto } from '../dto/get-single-media.dto';
import { GetMediaRatingDto } from '../dto/get-media-rating.dto';

@Controller('media')
@UseGuards(ApiKeyGuard)
export class MediaController {
  constructor(private aggregationService: AggregationService) {}

  @Get()
  findMedia(@Query() findMediaDto: FindMediaDto) {
    return this.aggregationService.findMedia(findMediaDto);
  }

  @Get('single')
  getSingleMedia(@Query() getSingleMediaDto: GetSingleMediaDto) {
    if (getSingleMediaDto.kinopoiskId || getSingleMediaDto.tmdbId) {
      return this.aggregationService.getSingleMedia(getSingleMediaDto);
    } else {
      throw new BadRequestException();
    }
  }

  @Get('single/rating')
  getRating(@Query() getMediaRatingDto: GetMediaRatingDto) {
    if (getMediaRatingDto.kinopoiskId || getMediaRatingDto.tmdbId) {
      return this.aggregationService.getMediaRating(getMediaRatingDto);
    } else {
      throw new BadRequestException();
    }
  }
}
