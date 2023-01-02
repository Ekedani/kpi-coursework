import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { RoleGuard } from '../guards/role.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/user-role.enum';
import { FindUsersDto } from '../dto/find-users.dto';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.Admin)
  @UseGuards(RoleGuard)
  findAll(@Query() findUsersDto: FindUsersDto) {
    return this.usersService.findAll(findUsersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== id && user.role !== UserRole.Admin) {
      throw new ForbiddenException();
    } else {
      return this.usersService.findOne(id);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== id && user.role !== UserRole.Admin) {
      throw new ForbiddenException();
    } else {
      return this.usersService.remove(id);
    }
  }

  @Post(':id/api-key')
  generateApiKey(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== id && user.role !== UserRole.Admin) {
      throw new ForbiddenException();
    } else {
      return this.usersService.generateApiKey(id);
    }
  }
}
