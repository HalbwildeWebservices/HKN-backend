import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKENKEY,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const user = await this.userService.findOne(userId);
    return new UserResponseDto(user);
  }
}
