import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
//import { readFileSync } from 'fs';

@Injectable()
export class AuthService {
  //private readonly privateKey: Buffer;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    //const privateKeyPath = process.env.TOKENKEY;
    //this.privateKey = readFileSync(privateKeyPath);
  }




  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const passOk = await compare(pass, user.password);
    if (user && passOk) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.TOKENKEY}),
    };
  }
}
