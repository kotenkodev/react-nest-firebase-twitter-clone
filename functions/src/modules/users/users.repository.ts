import { Injectable, Inject } from '@nestjs/common';
import { FIREBASE_DB } from '../firebase/firebase.module';
import {
  CollectionReference,
  FieldValue,
  Firestore,
} from 'firebase-admin/firestore';
import { User } from './entities/user.entity';
import { mapToEntity } from '../../common/utils/firestore.utils';

@Injectable()
export class UsersRepository {
  private readonly collection: CollectionReference;

  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {
    this.collection = this.db.collection('users');
  }

  async findOne(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async create(id: string, data: Partial<User>): Promise<User | null> {
    await this.collection.doc(id).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const docRef = this.collection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return mapToEntity(updatedDoc);
  }
}
