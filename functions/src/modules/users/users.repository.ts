import { Injectable, Inject } from '@nestjs/common';
import { FIREBASE_DB } from '../firebase/firebase.module';
import {
  CollectionReference,
  FieldValue,
  Firestore,
  Timestamp,
  DocumentSnapshot,
} from 'firebase-admin/firestore';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly collection: CollectionReference;

  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {
    this.collection = this.db.collection('users');
  }

  private mapToEntity(doc: DocumentSnapshot): User | null {
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      id: doc.id,
      ...this.convertTimestamps(data),
    } as User;
  }

  private convertTimestamps(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const converted = { ...data };
    for (const key in converted) {
      if (converted[key] instanceof Timestamp) {
        converted[key] = converted[key].toDate();
      } else if (
        typeof converted[key] === 'object' &&
        converted[key] !== null
      ) {
        converted[key] = this.convertTimestamps(converted[key]);
      }
    }
    return converted;
  }

  async findOne(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    return this.mapToEntity(doc);
  }

  async create(id: string, data: Partial<User>): Promise<void> {
    await this.collection.doc(id).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const docRef = this.collection.doc(id);
    await docRef.update(data);

    const updatedDoc = await docRef.get();
    return this.mapToEntity(updatedDoc)!;
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
