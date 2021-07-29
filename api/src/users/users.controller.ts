import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { HidePasswordInterceptor } from './interceptors/hide-password.interceptor';
import { UsersService } from './users.service';

@UseInterceptors(HidePasswordInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto).catch((exception) => {
            const msg = exception.detail;
            throw new BadRequestException('A user with email ' +  msg.split('=')[1].replace('(','').replace(')',''));
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
