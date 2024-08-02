import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    verifyAsync(token: string, { secret: string }) {
        throw new Error('Method not implemented.');
    }
    signAsync(payload: { id: any; name: any; password: any; }): any {
        throw new Error('Method not implemented.');
    }

    private readonly secretKey = 'your-secret-key'; // Replace with your own secret key

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' }); // You can customize the expiration time
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      // Handle token verification error (e.g., token expired, invalid, etc.)
      throw error;
    }
  }
}
