import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { RoleGuard } from '../guards/role.guard';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/api-key')
  generateApiKey(@Param('id') id: string) {
    return this.usersService.generateApiKey(id);
  }
}
