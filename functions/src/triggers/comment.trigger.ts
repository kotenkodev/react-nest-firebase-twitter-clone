import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

export const updatePostCommentCount = onDocumentWritten(
  'comments/{commentId}',
  async (event) => {
    const db = admin.firestore();
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    const postId = (afterData?.postId || beforeData?.postId) as string;
    const parentId = (afterData?.parentId || beforeData?.parentId) as string;

    if (!postId) {
      logger.error(`No postId found for comment: ${event.params.commentId}`);
      return;
    }

    const postRef = db.collection('posts').doc(postId);
    const batch = db.batch();

    const isCreated = !event.data?.before.exists && event.data?.after.exists;

    const isSoftDeleted =
      event.data?.before.exists &&
      event.data?.after.exists &&
      !beforeData?.isDeleted &&
      afterData?.isDeleted;

    const isHardDeleted =
      event.data?.before.exists && !event.data?.after.exists;

    try {
      if (isCreated) {
        batch.update(postRef, {
          commentsCount: FieldValue.increment(1),
        });
        if (parentId) {
          batch.update(db.collection('comments').doc(parentId), {
            replyCount: FieldValue.increment(1),
          });
        }
        await batch.commit();
        logger.info(
          `Successfully incremented comment count for post: ${postId}`,
        );
      } else if (isSoftDeleted || isHardDeleted) {
        batch.update(postRef, {
          commentsCount: FieldValue.increment(-1),
        });
        if (parentId) {
          batch.update(db.collection('comments').doc(parentId), {
            replyCount: FieldValue.increment(-1),
          });
        }
        await batch.commit();
        logger.info(
          `Successfully decremented comment count for post: ${postId}`,
        );
      }
    } catch (error: any) {
      if (error.code === 5) {
        logger.info(`Ignored comment count update for deleted post: ${postId}`);
        return;
      }
      logger.error('Error updating comment count:', error);
    }
  },
);
