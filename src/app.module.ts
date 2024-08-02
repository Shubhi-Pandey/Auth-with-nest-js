import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoListModule } from './to-do-list/to-do-list.module';
import { JwtService } from 'src/jwt/jwt.service';
import { ServiceJwt } from './to-do-list/jwt.service';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'appworks',
      synchronize: true,
    }),
    AuthModule,
    ToDoListModule
  ],
  
  controllers: [AppController],
  providers: [AppService, JwtService,ServiceJwt],
})
export class AppModule {}
