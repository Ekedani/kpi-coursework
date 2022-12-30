import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CinemasModule } from './cinemas/cinemas.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    CinemasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
