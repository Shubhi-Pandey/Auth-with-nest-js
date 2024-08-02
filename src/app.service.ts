import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Register(data: any): string {
    throw new Error('Method not implemented.');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
