import { Injectable } from '@nestjs/common';
import { CreateCinemaDto } from '../dto/create-cinema.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor() {}
  async create(createCinemaDto: CreateCinemaDto) {
    return 'This action adds a new cinema';
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
