import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { RoleGuard } from '../guards/role.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @UseGuards(RoleGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== id && user.role !== 'admin') {
      throw new ForbiddenException();
    } else {
      return this.usersService.findOne(id);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== id && user.role !== 'admin') {
      throw new ForbiddenException();
    } else {
      return this.usersService.remove(id);
    }
  }

  @Post(':id/api-key')
  generateApiKey(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== id && user.role !== 'admin') {
      throw new ForbiddenException();
    } else {
      return this.usersService.generateApiKey(id);
    }
  }
}
