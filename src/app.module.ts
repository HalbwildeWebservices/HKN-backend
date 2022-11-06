import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const username = process.env.DBUSER ?? '';
const password = process.env.DBPW ?? '';
const database = process.env.DBNAME ?? '';
const socketPath = process.env.DBSOCK ?? '';


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mariadb',
      dialectOptions: {
        socketPath, 
        trace: true, 
      },
      username,
      password,
      database,
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ]
})
export class AppModule {}
