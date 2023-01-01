import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}
  async validateKey(apiKey: string) {
    try {
      const user = await this.userRepository.findOneBy({ apiKey });
      return user !== null;
    } catch (e) {
      return false;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    return await this.validateKey(req.headers['x-api-key']);
  }
}
