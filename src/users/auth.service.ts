import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  async signUp(authCredentialsDto: AuthCredentialsDto) {}
}
