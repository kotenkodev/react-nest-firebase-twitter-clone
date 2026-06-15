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

  async findAll(): Promise<Post[]> {
    const snapshot = await this.collection
      .orderBy('likesCount', 'desc')
      .orderBy('commentsCount', 'asc')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => mapToEntity<Post>(doc)!);
  }

  async findOne(id: string): Promise<Post | null> {
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async create(id: string, data: Partial<Post>): Promise<Post> {
    await this.collection.doc(id).set({
      ...data,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc)!;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const docRef = this.collection.doc(id);

    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    return mapToEntity(updatedDoc)!;
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
