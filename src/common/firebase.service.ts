import { Injectable } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: 'AIzaSyCW41mBFMoQik1rGCbb7nYOIFi_Zo4rI4Y',
  authDomain: 'nest-img.firebaseapp.com',
  projectId: 'nest-img',
  storageBucket: 'nest-img.appspot.com',
  messagingSenderId: '178278877966',
  appId: '1:178278877966:web:bb36a0359a39df9adbe55f',
  measurementId: 'G-4M9T5WP2SJ',
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

@Injectable()
export class FirebaseService {
  async uploadFile(file: any): Promise<string> {
    const storageRef = ref(
      storage,
      `uploads/${uuidv4()}${extname(file.originalname)}`,
    );
    const snapshot = await uploadBytes(storageRef, file.buffer);
    return await getDownloadURL(snapshot.ref);
  }
}
