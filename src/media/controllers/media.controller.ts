import { Controller, Get } from '@nestjs/common';

@Controller('media')
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
