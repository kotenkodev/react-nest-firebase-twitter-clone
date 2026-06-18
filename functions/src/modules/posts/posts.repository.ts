import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_DB } from '../firebase/firebase.module';
import { mapToEntity } from '../../common/utils/firestore.utils';
import { Post } from './entities/post.entity';
import {
  CollectionReference,
  FieldValue,
  Firestore,
} from 'firebase-admin/firestore';

@Injectable()
export class PostsRepository {
  private readonly collection: CollectionReference;

  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {
    this.collection = this.db.collection('posts');
  }

  async findAll(
    limit: number,
    lastDocId?: string,
    searchText?: string,
    userId?: string,
    sortBy?: 'newest' | 'popular',
  ): Promise<Post[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (userId) {
      query = query.where('authorId', '==', userId);
    }

    if (searchText) {
      // algolia
    }

    if (sortBy === 'newest') {
      query = query.orderBy('createdAt', 'desc');
    } else if (sortBy === 'popular') {
      query = query
        .orderBy('likesCount', 'desc')
        .orderBy('commentsCount', 'asc')
        .orderBy('createdAt', 'desc');
    }

    if (lastDocId) {
      const lastDoc = await this.collection.doc(lastDocId).get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => mapToEntity<Post>(doc)!);
  }

  async findOne(id: string): Promise<Post | null> {
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async findManyByIds(ids: string[]): Promise<(Post | null)[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const refs = ids.map((id) => this.collection.doc(id));

    const snapshots = await this.db.getAll(...refs);

    return snapshots.map((snap) => {
      return snap.exists ? mapToEntity<Post>(snap) : null;
    });
  }

  async create(id: string, data: Partial<Post>): Promise<Post | null> {
    await this.collection.doc(id).set({
      ...data,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const docRef = this.collection.doc(id);

    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return mapToEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
