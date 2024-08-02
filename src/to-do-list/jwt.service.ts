// jwt.service.ts

import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ServiceJwt {
  getProfile(decoded: any): boolean {
      throw new Error('Method not implemented.');
  }
  private readonly secretKey = 'your-secret-key';

  // Create a new JWT token
  sign(payload: any): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' }); // Set the token expiration time
  }

  // Verify and decode a JWT token
  verify(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}