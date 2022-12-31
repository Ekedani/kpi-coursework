import { DataSource, Repository, Like } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { FindUsersDto } from '../dto/find-users.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAll(findUsersDto: FindUsersDto) {
    const take = 20;
    const page = findUsersDto.page || 1;
    const skip = (page - 1) * take;

    const [result, total] = await this.findAndCount({
      where: {},
      take: take,
      skip: skip,
    });

    return {
      data: result,
      count: total,
    };
  }
}
