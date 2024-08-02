import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ServiceJwt} from './jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: ServiceJwt) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    //console.log(token)
    if (!token) {
        throw new HttpException({
            status: "error",
            statuscode: HttpStatus.BAD_REQUEST,
            message: "Token is not provided"
        }, HttpStatus.BAD_REQUEST)
    }
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
       // Attach the user to the request for future use
      //console.log(decoded)
      return request.user;
    } catch (error) {
      
      throw new HttpException({
        status: "error",
        statuscode: HttpStatus.BAD_REQUEST,
        message: "Invalid token"
    }, HttpStatus.BAD_REQUEST)
    }
  }
}