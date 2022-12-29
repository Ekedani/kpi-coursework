import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { SignUpCredentialsDto } from '../dto/sign-up-credentials.dto';
import { SignInCredentialsDto } from '../dto/sign-in-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../common/user-role.enum';
import { JwtPayload } from '../common/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    const { firstName, lastName, email, password } = signUpCredentialsDto;
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await this.userRepository.save({
        firstName,
        lastName,
        email,
        role: UserRole.User,
        password: hashedPassword,
      });
      const payload: JwtPayload = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
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
        const payload: JwtPayload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
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
