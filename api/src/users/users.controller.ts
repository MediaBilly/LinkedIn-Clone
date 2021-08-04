import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors, Request, Delete, ForbiddenException, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordAdminDto } from './dto/change-password-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OnlyAdminsGuard } from './guards/only-admins.guard';
import { HidePasswordInterceptor } from './interceptors/hide-password.interceptor';
import { UsersService } from './users.service';

@UseInterceptors(HidePasswordInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard, OnlyAdminsGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+req.user.id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard, OnlyAdminsGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('changepassword')
    async changeMyPassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        const passOk = await this.usersService.checkPassword(req.user, changePasswordDto.oldPassword);
        if (passOk) {
            return this.usersService.changePassword(+req.user.id,changePasswordDto.newPassword);
        } else {
            throw new ForbiddenException("Wrong Password!");
        }
    }

    @UseGuards(JwtAuthGuard, OnlyAdminsGuard)
    @Patch('changepassword/:id')
    async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordAdminDto) {
        return this.usersService.changePassword(+id,changePasswordDto.newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteMe(@Request() req) {
        return this.usersService.delete(+req.user.id);
    }

    @UseGuards(JwtAuthGuard, OnlyAdminsGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(+id);
    }
}
