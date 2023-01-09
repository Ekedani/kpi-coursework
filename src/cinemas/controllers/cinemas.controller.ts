import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CinemasService } from '../services/cinemas.service';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../../users/common/user-role.enum';
import { Roles } from '../../users/decorators/roles.decorator';
import { RoleGuard } from '../../users/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyGuard } from '../../users/guards/api-key.guard';
import { FindCinemasDto } from '../dto/find-cinemas.dto';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard(), RoleGuard)
  @UseInterceptors(FileInterceptor('picture'))
  create(@UploadedFile() picture, @Body() createCinemaDto: CreateCinemaDto) {
    if (picture) {
      if (picture.mimetype !== 'image/jpeg' || picture.size > 1000 * 1000) {
        throw new BadRequestException('image must be jpeg with max size 1mb');
      }
    }
    return this.cinemasService.create(picture, createCinemaDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  findAll(@Query() findCinemasDto: FindCinemasDto) {
    return this.cinemasService.findAll(findCinemasDto);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cinemasService.findOne(id);
  }

  @Get(':id/picture')
  @UseGuards(ApiKeyGuard)
  async findPicture(@Param('id', ParseUUIDPipe) id: string, @Res() res) {
    const path = await this.cinemasService.findPicture(id);
    res.setHeader('content-type', 'image/jpeg');
    res.sendFile(path, { root: 'uploads' });
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard(), RoleGuard)
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() picture,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ) {
    if (picture) {
      if (picture.mimetype !== 'image/jpeg' || picture.size > 1000 * 1000) {
        throw new BadRequestException('image must be jpeg with max size 1mb');
      }
    }
    return this.cinemasService.update(id, picture, updateCinemaDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard(), RoleGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cinemasService.remove(id);
  }
}
