import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return `This action returns a user with id #${id}`;
  }

  async remove(id: string) {
    return `This action removes a user with id #${id}`;
  }

  async generateApiKey(id: string) {
    try {
      const newKey = randomUUID();
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException();
      } else {
        user.apiKey = newKey;
        await this.userRepository.save(user);
        return { apiKey: newKey };
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
