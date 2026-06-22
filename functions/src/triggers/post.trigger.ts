import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';

export const updatePostCommentCount = onDocumentDeleted(
  'posts/{postId}',
  async (event) => {
    const db = admin.firestore();
    const postId = event.params.postId;

    if (!postId) {
      logger.error(`No postId found for post: ${event.params.postId}`);
      return;
    }

    const postRef = db.collection('posts').doc(postId);
    const batch = db.batch();
  },
);
