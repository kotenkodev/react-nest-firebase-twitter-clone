import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_DB } from '../../modules/firebase/firebase.module';
import {
  CollectionReference,
  FieldValue,
  Firestore,
} from 'firebase-admin/firestore';
import { mapToEntity } from '../../common/utils/firestore.utils';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesRepository {
  private readonly collection: CollectionReference;

  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {
    this.collection = this.db.collection('likes');
  }

  async findOne(id: string): Promise<Like | null> {
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async findManyByIds(ids: string[]): Promise<Like[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const refs = ids.map((id) => this.collection.doc(id));

    const snapshots = await this.db.getAll(...refs);

    return snapshots
      .map((snap) => mapToEntity<Like>(snap))
      .filter((like): like is Like => like !== null);
  }

  async create(id: string, like: Partial<Like>): Promise<Like | null> {
    const docRef = this.collection.doc(id);

    await docRef.set({
      ...like,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async update(id: string, data: Partial<Like>): Promise<Like | null> {
    const docRef = this.collection.doc(id);

    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await this.collection.doc(id).get();
    return mapToEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
