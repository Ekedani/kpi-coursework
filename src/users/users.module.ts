import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { User } from './entities/user.entity';
import { JwtStrategy } from './services/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, UserRepository, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
