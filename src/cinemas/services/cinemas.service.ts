import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';
import { CinemaRepository } from '../repositories/cinema.repository';
import { FindCinemasDto } from '../dto/find-cinemas.dto';

@Injectable()
export class CinemasService {
  constructor(private cinemaRepository: CinemaRepository) {}
  async create(createCinemaDto: CreateCinemaDto) {
    try {
      return createCinemaDto;
    } catch (e) {
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
      cinemas.data.forEach((cinema) => delete cinema.picture);
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
      return `This action returns a #${id} cinema`;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto) {
    try {
      return `This action updates a #${id} cinema`;
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
      return `This action removes a #${id} cinema`;
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
      return `This action updates a #${id} cinema picture`;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
