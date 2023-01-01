import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}
  validateKey(apiKey: string) {
    const user = this.userRepository.findOneBy({ apiKey });
    return user !== null;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateKey(req.headers['x-api-key']);
  }
}
