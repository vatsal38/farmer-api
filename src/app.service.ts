import { Injectable } from '@nestjs/common';
import { FirebaseService } from './core/firebase/firebase.service';

@Injectable()
export class AppService {
  constructor(private readonly firebaseService: FirebaseService) {
    this.firebaseService.initFirebase();
  }
  getHello(): string {
    return 'Hello World!';
  }
}
