import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';
import { CinemaRepository } from '../repositories/cinema.repository';
import { FindCinemasDto } from '../dto/find-cinemas.dto';

@Injectable()
export class CinemasService {
  constructor(private cinemaRepository: CinemaRepository) {}

  async create(picture, createCinemaDto: CreateCinemaDto) {
    try {
      return await this.cinemaRepository.save({
        name: createCinemaDto.name,
        description: createCinemaDto.description,
        picture: picture?.filename,
        link: createCinemaDto.link,
      });
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(findCinemaDto: FindCinemasDto) {
    try {
      const cinemas = await this.cinemaRepository.findAll(findCinemaDto);
      return { data: cinemas.data, totalPages: cinemas.total };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(id: string) {
    try {
      const cinema = await this.cinemaRepository.findOneBy({ id });
      if (!cinema) {
        throw new NotFoundException();
      } else {
        delete cinema.picture;
        return cinema;
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async update(id: string, picture, updateCinemaDto: UpdateCinemaDto) {
    try {
      const cinema = await this.cinemaRepository.findOneBy({ id });
      if (!cinema) {
        throw new NotFoundException();
      }
      if (picture) {
        //TODO: Multer delete picture
      }
      return await this.cinemaRepository.save({
        id: cinema.id,
        ...updateCinemaDto,
        picture: picture?.filename,
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: string) {
    try {
      const cinema = this.cinemaRepository.findOneBy({ id });
      if (!cinema) {
        throw new NotFoundException();
      }
      //TODO: Multer delete picture
      await this.cinemaRepository.delete({ id });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findPicture(id: string) {
    try {
      return (await this.cinemaRepository.findOneBy({ id })).picture;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
