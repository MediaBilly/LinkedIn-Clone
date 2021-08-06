import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors, Request, Delete, ForbiddenException, Patch, Req } from '@nestjs/common';
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

    // Basic Functionality

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
        return this.usersService.findOne(+id);
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
    @Patch('change-password')
    async changeMyPassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        const passOk = await this.usersService.checkPassword(req.user, changePasswordDto.oldPassword);
        if (passOk) {
            return this.usersService.changePassword(+req.user.id,changePasswordDto.newPassword);
        } else {
            throw new ForbiddenException("Wrong Password!");
        }
    }

    @UseGuards(JwtAuthGuard, OnlyAdminsGuard)
    @Patch('change-password/:id')
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

    // Friend Requests

    @UseGuards(JwtAuthGuard)
    @Get('friend-requests/sent')
    getSentFriendRequests(@Request() req) {
        return this.usersService.getSentFriendRequests(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('friend-requests/received')
    getReceivedFriendRequests(@Request() req) {
        return this.usersService.getReceivedFriendRequests(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('friend-requests/send/:receiver')
    sendFriendRequest(@Request() req, @Param('receiver') receiver: string) {
        return this.usersService.sendFriendRequest(req.user,+receiver);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('friend-requests/cancel/:id')
    cancelFriendRequest(@Request() req, @Param('id') id: string) {
        return this.usersService.cancelFriendRequest(+id, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('friend-requests/accept/:id')
    acceptFriendRequest(@Request() req, @Param('id') id: string) {
        return this.usersService.acceptFriendRequest(+id, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('friend-requests/decline/:id')
    declineFriendRequest(@Request() req, @Param('id') id: string) {
        return this.usersService.declineFriendRequest(+id, req.user);
    }

    // Friendships

    @UseGuards(JwtAuthGuard)
    @Get('friends/:id')
    getFriends(@Param('id') id: string) {
        return this.usersService.getFriends(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('friends/:id')
    removeFriend(@Request() req, @Param('id') id: string) {
        return this.usersService.removeFriend(req.user.id, +id);
    }
}
