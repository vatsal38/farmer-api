import { Injectable } from '@nestjs/common';
import { FirebaseService } from './core/firebase/firebase.service';

@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return 'Hello World!';
  }
}
