import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { LoginUserDto } from './users/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('auth')
  @UseGuards(LocalAuthGuard)
  @ApiBody({type: LoginUserDto})
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
