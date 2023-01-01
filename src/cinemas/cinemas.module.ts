import { Module } from '@nestjs/common';
import { CinemasService } from './services/cinemas.service';
import { CinemasController } from './controllers/cinemas.controller';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CinemasController],
  providers: [CinemasService],
})
export class CinemasModule {}
