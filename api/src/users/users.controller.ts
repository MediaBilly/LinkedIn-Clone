import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors, Request, Delete, ForbiddenException, Patch, UploadedFile, Res, NotFoundException, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordAdminDto } from './dto/change-password-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FriendRequestSameReceiverGuard } from './guards/friend-request-same-receiver.guard';
import { FriendRequestSameSenderGuard } from './guards/friend-request-same-sender.guard';
import { OnlyAdminsGuard } from './guards/only-admins.guard';
import { getProfilePicLocation, profilePicOptions } from './helpers/profile-pic-storage';
import { HidePasswordInterceptor } from './interceptors/hide-password.interceptor';
import { UsersService } from './users.service';

@UseInterceptors(HidePasswordInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    // Basic Functionality

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
        const userWithPassword = await this.usersService.findLoginUser(req.user.email);
        const passOk = await this.usersService.checkPassword(userWithPassword, changePasswordDto.oldPassword);
        if (passOk) {
            return this.usersService.changePassword(userWithPassword.id,changePasswordDto.newPassword);
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

    @UseGuards(JwtAuthGuard)
    @Get(':id/profile-pic')
    async getProfilePic(@Param('id') id: string, @Res() res) {
        const user = await this.usersService.findOne(+id);
        if (user.profilePicName) {
            return res.sendFile(getProfilePicLocation(user.profilePicName));
        } else {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile-pic')
    @UseInterceptors(FileInterceptor('pic', profilePicOptions))
    changeProfilePic(@UploadedFile() pic: Express.Multer.File, @Request() req) {
        if (pic) {
            return this.usersService.changeProfilePic(+req.user.id, pic.filename);
        } else {
            throw new BadRequestException("Incorrect image type.");
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('profile-pic/delete') 
    deleteProfilePic(@Request() req) {
        return this.usersService.deleteProfilePic(+req.user.id);
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

    @UseGuards(JwtAuthGuard, FriendRequestSameSenderGuard)
    @Delete('friend-requests/cancel/:id')
    cancelFriendRequest(@Request() req, @Param('id') id: string) {
        return this.usersService.cancelFriendRequest(+id);
    }

    @UseGuards(JwtAuthGuard, FriendRequestSameReceiverGuard)
    @Post('friend-requests/accept/:id')
    acceptFriendRequest(@Request() req, @Param('id') id: string) {
        return this.usersService.acceptFriendRequest(+id);
    }

    @UseGuards(JwtAuthGuard, FriendRequestSameReceiverGuard)
    @Post('friend-requests/decline/:id')
    declineFriendRequest(@Request() req, @Param('id') id: string) {
        return this.usersService.declineFriendRequest(+id);
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
