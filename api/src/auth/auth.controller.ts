import { Body, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HidePasswordInterceptor } from 'src/users/interceptors/hide-password.interceptor';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@UseInterceptors(HidePasswordInterceptor)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }
}
