import { Module } from '@nestjs/common';
import { CinemasService } from './services/cinemas.service';
import { CinemasController } from './controllers/cinemas.controller';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { CinemaRepository } from './repositories/cinema.repository';

/**
 * Summary: This module is responsible for cinema access and management
 */
@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([Cinema]),
  ],
  controllers: [CinemasController],
  providers: [CinemasService, CinemaRepository],
})
export class CinemasModule {}
