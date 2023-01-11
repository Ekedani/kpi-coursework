import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { randomUUID } from 'crypto';
import { FindUsersDto } from '../dto/find-users.dto';

/**
 * Summary: This service is responsible for the business logic of managing and
 * retrieving information about users
 */
@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findAll(findUsersDto: FindUsersDto) {
    const users = await this.userRepository.findAll(findUsersDto);
    users.data.forEach((user) => delete user.password);
    return { data: users.data, total: users.total, pages: users.pages };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    } else {
      return {
        id: user.id,
        apiKey: user.apiKey,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
      };
    }
  }

  async remove(id: string) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async generateApiKey(id: string) {
    const newKey = randomUUID();
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    } else {
      user.apiKey = newKey;
      await this.userRepository.save(user);
      return { apiKey: newKey };
    }
  }
}
