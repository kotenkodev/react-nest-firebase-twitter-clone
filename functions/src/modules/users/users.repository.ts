import { Injectable, Inject } from '@nestjs/common';
import { FIREBASE_DB } from '../firebase/firebase.module';
import * as admin from 'firebase-admin';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly collection: admin.firestore.CollectionReference;

  constructor(
    @Inject(FIREBASE_DB) private readonly db: admin.firestore.Firestore,
  ) {
    this.collection = this.db.collection('users');
  }

  async findOne(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as User;
  }

  async create(id: string, data: Partial<User>): Promise<void> {
    await this.collection.doc(id).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
