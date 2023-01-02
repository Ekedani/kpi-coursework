import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cinema } from '../entities/cinema.entity';
import { FindCinemasDto } from '../dto/find-cinemas.dto';
import { UpdateCinemaDto } from '../dto/update-cinema.dto';

@Injectable()
export class CinemaRepository extends Repository<Cinema> {
  constructor(private dataSource: DataSource) {
    super(Cinema, dataSource.createEntityManager());
  }

  async findAll(findCinemasDto: FindCinemasDto) {
    const take = 20;
    const page = findCinemasDto.page || 1;
    const skip = (page - 1) * take;

    const [result, total] = await this.findAndCount({
      where: {},
      take: take,
      skip: skip,
    });
    const pages = Math.floor(total / take) + 1;
    return {
      data: result,
      total: total,
      pages,
    };
  }
}
