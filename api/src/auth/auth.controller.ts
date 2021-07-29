import { Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { HidePasswordInterceptor } from 'src/users/interceptors/hide-password.interceptor';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@UseInterceptors(HidePasswordInterceptor)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
