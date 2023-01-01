import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CinemasService } from '../services/cinemas.service';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../../users/common/user-role.enum';
import { Roles } from '../../users/decorators/roles.decorator';
import { RoleGuard } from '../../users/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @UseGuards(AuthGuard())
  @Roles(UserRole.Admin)
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('picture'))
  create(@UploadedFile() picture, @Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }

  @Get()
  /* TODO: API KEY guard */
  findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id')
  /* TODO: API KEY guard */
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(id);
  }

  @Get(':id/picture')
  /* TODO: API KEY guard */
  findPicture(@Param('id') id: string) {
    return this.cinemasService.findPicture(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @Roles(UserRole.Admin)
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @Param('id') id: string,
    @UploadedFile() picture,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ) {
    return this.cinemasService.update(id, updateCinemaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @Roles(UserRole.Admin)
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(id);
  }
}
