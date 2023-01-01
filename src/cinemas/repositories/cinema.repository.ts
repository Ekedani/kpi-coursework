import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cinema } from '../entities/cinema.entity';

@Injectable()
export class UserRepository extends Repository<Cinema> {
  constructor(private dataSource: DataSource) {
    super(Cinema, dataSource.createEntityManager());
  }
}
