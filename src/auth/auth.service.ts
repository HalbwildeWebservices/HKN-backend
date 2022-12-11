import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/users/models/user.model';
//import { readFileSync } from 'fs';

@Injectable()
export class AuthService {
  //private readonly privateKey: Buffer;
  private readonly logger = new Logger('AuthService');
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    //const privateKeyPath = process.env.TOKENKEY;
    //this.privateKey = readFileSync(privateKeyPath);
  }




  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    const passOk = await compare(pass, user.password);
    if (user && passOk) {
      return user.get();
    }
    return null;
  }

  async login(user: User) {
    this.logger.log(`login of user ${user.username} (${user.userId})`);
    const payload = { 
      preferred_username: user.username, 
      sub: user.userId, 
      iat: Date.now(), 
      iss: 'Halbwilde Kajakfahrer Norddeutschland', 
      updated_at: user.updatedAt.valueOf(),
      roles: user.permissions.map((p) => p.name),
    };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.TOKENKEY}),
    };
  }
}
