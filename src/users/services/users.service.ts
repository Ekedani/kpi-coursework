import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a user with id #${id}`;
  }

  remove(id: string) {
    return `This action removes a user with id #${id}`;
  }

  generateApiKey(id: string) {
    return `Placeholder`;
  }
}
