import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    const { firstName, lastName, email, password } = signUpCredentialsDto;
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      console.log(signUpCredentialsDto, hashedPassword);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  signIn(signInCredentialsDto: SignInCredentialsDto) {
    const { email, password } = signInCredentialsDto;
    try {
      console.log(signInCredentialsDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
