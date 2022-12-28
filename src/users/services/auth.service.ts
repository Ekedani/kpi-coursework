import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { SignUpCredentialsDto } from '../dto/sign-up-credentials.dto';
import { SignInCredentialsDto } from '../dto/sign-in-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    const { firstName, lastName, email, password } = signUpCredentialsDto;
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.userRepository.save({
        firstName,
        lastName,
        email,
        role: 'user',
        password: hashedPassword,
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto) {
    const { email, password } = signInCredentialsDto;
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        console.log('Success', user);
      } else {
        throw new UnauthorizedException();
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
