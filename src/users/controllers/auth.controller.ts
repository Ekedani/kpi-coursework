import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpCredentialsDto } from '../dto/sign-up-credentials.dto';
import { SignInCredentialsDto } from '../dto/sign-in-credentials.dto';

/**
 * Summary: This controller is responsible for user login and registration to
 * the service
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto);
  }
}
