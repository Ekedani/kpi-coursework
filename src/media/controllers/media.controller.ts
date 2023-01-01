import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../users/guards/api-key.guard';

@Controller('media')
@UseGuards(ApiKeyGuard)
export class MediaController {
  @Get()
  findMedia() {
    return null;
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
