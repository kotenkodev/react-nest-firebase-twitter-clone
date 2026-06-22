import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { Like, LikeType } from '../modules/likes/entities/like.entity';

export const updatePostReactionCount = onDocumentWritten(
  'likes/{interactionId}',
  async (event) => {
    const db = admin.firestore();
    const beforeData = event.data?.before.data() as Partial<Like> | undefined;
    const afterData = event.data?.after.data() as Partial<Like> | undefined;

    const postId = (afterData?.postId || beforeData?.postId) as string;
    if (!postId) return;

    const postRef = db.collection('posts').doc(postId);

    try {
      if (!event.data?.before.exists && event.data?.after.exists) {
        const fieldToIncrement =
          afterData?.type === LikeType.LIKE ? 'likesCount' : 'dislikesCount';

        return await postRef.update({
          [fieldToIncrement]: FieldValue.increment(1),
        });
      }

      if (event.data?.before.exists && !event.data?.after.exists) {
        const fieldToDecrement =
          beforeData?.type === LikeType.LIKE ? 'likesCount' : 'dislikesCount';

        return await postRef.update({
          [fieldToDecrement]: FieldValue.increment(-1),
        });
      }

      if (event.data?.before.exists && event.data?.after.exists) {
        const oldType = beforeData?.type;
        const newType = afterData?.type;

        if (oldType === newType) return;

        const fieldToDecrement =
          oldType === LikeType.LIKE ? 'likesCount' : 'dislikesCount';
        const fieldToIncrement =
          newType === LikeType.LIKE ? 'likesCount' : 'dislikesCount';

        return await postRef.update({
          [fieldToDecrement]: FieldValue.increment(-1),
          [fieldToIncrement]: FieldValue.increment(1),
        });
      }
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 5) {
        logger.info(`Ignored like update for deleted post: ${postId}`);
        return;
      }

      logger.error('Error updating post reaction count:', err);
    }
  },
);
