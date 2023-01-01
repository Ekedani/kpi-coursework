import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor() {}
  async create(createCinemaDto: CreateCinemaDto) {
    /*try {
      const cinemas = await this.userRepository.findAll(findUsersDto);
      cinemas.data.forEach((cinema) => delete cinema.picture);
      return { data: cinemas.data, totalPages: cinemas.total };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }*/
  }

  async findAll() {
    return `This action returns all cinemas`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} cinema`;
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto) {
    return `This action updates a #${id} cinema`;
  }

  async remove(id: string) {
    return `This action removes a #${id} cinema`;
  }

  async findPicture(id: string) {
    try {
    } catch (e) {}
    return id;
  }
}
