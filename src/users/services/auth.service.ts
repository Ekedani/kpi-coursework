import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt)
    try {
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
      // Duplicate email
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw e;
    }
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto) {
    const { email, password } = signInCredentialsDto;
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
  }
}
