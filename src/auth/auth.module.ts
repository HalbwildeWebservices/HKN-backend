import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
//import { readFileSync } from 'fs';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

//const publicKey = readFileSync('src/assets/tokenPublicKey/tokenKeyPublic.pem');
//const privateKey = readFileSync(process.env.TOKENKEY);

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      //privateKey,
      //publicKey,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
