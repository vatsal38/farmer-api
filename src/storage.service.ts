import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { FirebaseService } from './core/firebase/firebase.service';

@Injectable()
class StorageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadFile(file: any, destination: string): Promise<string> {
    const storageBucket = this.firebaseService.getBucket();
    const uniqueId = uuidv4();
    const destinationPath = `${destination}/${uniqueId}${path.extname(file.originalname)}`;

    await storageBucket.file(destinationPath).save(file.buffer, {
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uniqueId,
        },
      },
    });

    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${storageBucket.name}/o/${encodeURIComponent(destinationPath)}?alt=media&token=${uniqueId}`;

    return downloadURL;
  }
}

export default StorageService;
