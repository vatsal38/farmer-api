import { ApiConfigService } from './../../api-config.service';
import { Bucket } from '@google-cloud/storage';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class FirebaseService {
  constructor(
    private apiConfigService: ApiConfigService,
    private httpService: HttpService,
  ) {}

  initFirebase() {
    const adminConfig: ServiceAccount = {
      projectId: this.apiConfigService.firebaseProjectId,
      privateKey: this.apiConfigService.firebasePrivateKey.replace(
        /\\n/g,
        '\n',
      ),
      clientEmail: this.apiConfigService.firebaseClientEmail,
    };
    admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
      storageBucket: this.apiConfigService.firebaseStorageBucket,
    });
  }

  getBucket(): Bucket {
    return admin.storage().bucket();
  }

  generateDynamicLink(link: string): Observable<AxiosResponse<string>> {
    const uri = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${this.apiConfigService.firebaseApiKey}`;
    const domainUriPrefix = this.apiConfigService.domainPrefix;
    const androidPackageName = this.apiConfigService.androidPackageId;
    const iosPackageName = this.apiConfigService.iosPackageId;
    const body = {
      dynamicLinkInfo: {
        domainUriPrefix,
        link,
        androidInfo: {
          androidPackageName,
        },
        iosInfo: {
          iosBundleId: iosPackageName,
        },
      },
    };
    return this.httpService.post(uri, body);
  }
}
