import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';
import { CinemaRepository } from '../repositories/cinema.repository';
import { FindCinemasDto } from '../dto/find-cinemas.dto';
import { unlinkSync } from 'fs';

/**
 * Summary: This service is responsible for the business logic of managing and
 * retrieving information about cinemas
 */
@Injectable()
export class CinemasService {
  constructor(private cinemaRepository: CinemaRepository) {}

  async create(picture, createCinemaDto: CreateCinemaDto) {
    return await this.cinemaRepository.save({
      name: createCinemaDto.name,
      description: createCinemaDto.description,
      picture: picture?.filename,
      link: createCinemaDto.link,
    });
  }

  async findAll(findCinemasDto: FindCinemasDto) {
    const cinemas = await this.cinemaRepository.findAll(findCinemasDto);
    cinemas.data.forEach((cinema) => {
      if (!cinema.picture) {
        delete cinema.picture;
      }
    });
    return { data: cinemas.data, total: cinemas.total, pages: cinemas.pages };
  }

  async findOne(id: string) {
    const cinema = await this.cinemaRepository.findOneBy({ id });
    if (!cinema) {
      throw new NotFoundException();
    }
    if (!cinema.picture) {
      delete cinema.picture;
    }
    return cinema;
  }

  async update(id: string, picture, updateCinemaDto: UpdateCinemaDto) {
    const cinema = await this.cinemaRepository.findOneBy({ id });
    if (!cinema) {
      throw new NotFoundException();
    }
    if (picture && cinema.picture) {
      unlinkSync(`./uploads/${cinema.picture}`);
    }
    return await this.cinemaRepository.save({
      id: cinema.id,
      ...updateCinemaDto,
      picture: picture?.filename,
    });
  }

  async remove(id: string) {
    const cinema = await this.cinemaRepository.findOneBy({ id });
    if (!cinema) {
      throw new NotFoundException();
    }
    if (cinema.picture) {
      unlinkSync(`./uploads/${cinema.picture}`);
    }
    await this.cinemaRepository.delete({ id });
  }

  async findPicture(id: string) {
    const path = (await this.cinemaRepository.findOneBy({ id })).picture;
    if (!path) {
      throw new NotFoundException();
    } else {
      return path;
    }
  }
}
