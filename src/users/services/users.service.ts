import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { randomUUID } from 'crypto';
import { FindUsersDto } from '../dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findAll(findUsersDto: FindUsersDto) {
    try {
      const users = await this.userRepository.findAll(findUsersDto);
      return { users };
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
      const result = await this.userRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException();
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
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
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
