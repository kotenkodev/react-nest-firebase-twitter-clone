import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_DB } from 'src/modules/firebase/firebase.module';
import { CollectionReference, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class LikesRepository {
  private readonly collection: CollectionReference;

  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {
    this.collection = this.db.collection('likes');
  }
}
