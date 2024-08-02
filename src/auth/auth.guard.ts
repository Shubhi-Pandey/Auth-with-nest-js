import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from 'src/jwt/jwt.service';
  import { jwtConstants } from 'src/auth/auth.constants';
  import { Request } from 'express';
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split('') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      let token = request.headers['x-access-token'] || request.headers['authorization'];
      if (!token) {
       // throw new UnauthorizedException();
       console.log("token not provided")
      }
    //   try {
        const payload = await this.jwtService.verifyAsync(         
          token,
          {
            secret: jwtConstants.secret
          }
        );
        console.log(payload);
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
    //   } catch {
    //     throw new UnauthorizedException();
    //   }
      return true;
    }
  }

