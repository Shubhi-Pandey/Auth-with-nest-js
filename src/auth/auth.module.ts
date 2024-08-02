import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {JwtService } from 'src/jwt/jwt.service';
import { ServiceJwt } from 'src/to-do-list/jwt.service';

@Module({
 imports:[ JwtModule,TypeOrmModule],
  controllers: [AuthController],
  providers: [AuthService,JwtService,ServiceJwt]
})

export class AuthModule {

}
