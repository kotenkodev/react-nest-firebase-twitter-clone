import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_AUTH = 'FIREBASE_AUTH';
export const FIREBASE_DB = 'FIREBASE_DB';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        if (admin.apps.length === 0) {
          return admin.initializeApp();
        }
        return admin.app();
      },
    },
    {
      provide: FIREBASE_AUTH,
      useFactory: (app: admin.app.App) => {
        return admin.auth(app);
      },
      inject: ['FIREBASE_APP'],
    },
    {
      provide: FIREBASE_DB,
      useFactory: (app: admin.app.App) => {
        return admin.firestore(app);
      },
      inject: ['FIREBASE_APP'],
    },
  ],
  exports: [FIREBASE_AUTH, FIREBASE_DB],
})
export class FirebaseModule {}
