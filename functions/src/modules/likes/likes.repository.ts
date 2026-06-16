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

  async findManyByIds(ids: string[]): Promise<(Like | null)[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const refs = ids.map((id) => this.collection.doc(id));

    const snapshots = await this.db.getAll(...refs);

    return snapshots.map((snap) => {
      return snap.exists ? mapToEntity<Like>(snap) : null;
    });
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

  async deleteLikesByPostId(id: string): Promise<void> {
    const query = this.collection.where('postId', '==', id);
    const snapshot = await query.get();

    if (snapshot.empty) return;

    const MAX_BATCH_SIZE = 500;
    const batchPromises: Promise<any>[] = [];
    let currentBatch = this.db.batch();
    let operationCount = 0;

    snapshot.docs.forEach((doc) => {
      currentBatch.delete(doc.ref);
      operationCount++;

      if (operationCount === MAX_BATCH_SIZE) {
        batchPromises.push(currentBatch.commit());
        currentBatch = this.db.batch();
        operationCount = 0;
      }
    });

    if (operationCount > 0) {
      batchPromises.push(currentBatch.commit());
    }

    await Promise.all(batchPromises);
  }
}
