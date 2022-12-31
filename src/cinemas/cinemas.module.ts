import { Module } from '@nestjs/common';
import { CinemasService } from './services/cinemas.service';
import { CinemasController } from './controllers/cinemas.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CinemasController],
  providers: [CinemasService],
})
export class CinemasModule {}
