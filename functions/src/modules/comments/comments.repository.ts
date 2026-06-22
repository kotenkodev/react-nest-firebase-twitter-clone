import {
  CollectionReference,
  FieldValue,
  Firestore,
} from 'firebase-admin/firestore';
import { FIREBASE_DB } from '../firebase/firebase.module';
import { Inject, Injectable } from '@nestjs/common';
import { mapToEntity } from '../../common/utils/firestore.utils';
import { Comment } from './entities/comment.entity';
import { CommentQueryDto } from './dto/comment-query.dto';

@Injectable()
export class CommentsRepository {
  private readonly collection: CollectionReference;

  constructor(@Inject(FIREBASE_DB) private readonly db: Firestore) {
    this.collection = db.collection('comments');
  }

  async findAll(postId: string, options: CommentQueryDto): Promise<Comment[]> {
    let query = this.collection.where('postId', '==', postId);
    const { limit = 10, parentId, lastDocId } = options;

    if (parentId) {
      query = query
        .where('parentId', '==', parentId)
        .orderBy('createdAt', 'asc');
    } else {
      query = query.where('parentId', '==', null).orderBy('createdAt', 'desc');
    }

    if (lastDocId) {
      const lastDoc = await this.collection.doc(lastDocId).get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => mapToEntity<Comment>(doc)!);
  }

  async findOne(id: string): Promise<Comment | null> {
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc);
  }

  async create(data: Partial<Comment>): Promise<Comment> {
    const docRef = this.collection.doc();

    await docRef.set({
      ...data,
      replyCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return mapToEntity(doc)!;
  }

  async update(id: string, data: Partial<Comment>): Promise<Comment> {
    await this.collection
      .doc(id)
      .set(
        { ...data, isEdited: true, updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
    const doc = await this.collection.doc(id).get();
    return mapToEntity(doc)!;
  }

  async delete(id: string): Promise<Comment | void> {
    const docRef = this.collection.doc(id);

    const commentDoc = await docRef.get();

    const hasReplies = commentDoc.exists && commentDoc.data()?.replyCount > 0;

    if (hasReplies) {
      await docRef.update({
        isDeleted: true,
        content: '[deleted]',
        updatedAt: FieldValue.serverTimestamp(),
      });
      const doc = await this.collection.doc(id).get();
      return mapToEntity(doc)!;
    } else {
      await this.collection.doc(id).delete();
    }
  }
}
