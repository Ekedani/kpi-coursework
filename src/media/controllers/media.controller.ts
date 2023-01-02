import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../users/guards/api-key.guard';
import { AggregationService } from '../services/aggregation.service';
import { FindMediaDto } from '../dto/find-media.dto';

@Controller('media')
@UseGuards(ApiKeyGuard)
export class MediaController {
  constructor(private aggregationService: AggregationService) {}

  @Get()
  findMedia(@Query() findMediaDto: FindMediaDto) {
    return this.aggregationService.findMedia(findMediaDto);
  }

  @Get(':imdbId')
  getSingleMedia() {
    return null;
  }

  @Get(':imdbId/rating')
  getRating() {
    return null;
  }
}
