import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';

async function deleteCollection(
  db: admin.firestore.Firestore,
  query: admin.firestore.Query,
): Promise<number> {
  const snapshot = await query.get();
  if (snapshot.empty) return 0;

  const writer = db.bulkWriter();
  snapshot.forEach((doc) => {
    void writer.delete(doc.ref);
  });
  await writer.close();

  return snapshot.size;
}

export const onPostDeleted = onDocumentDeleted(
  'posts/{postId}',
  async (event) => {
    const db = admin.firestore();
    const bucket = admin.storage().bucket();
    const postId = event.params.postId;

    try {
      await bucket.file(`posts/${postId}`).delete();
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: number }).code === 404
      ) {
        logger.warn(`Photo not found for post: ${postId}, skipping`);
      } else {
        logger.error('Failed to delete post photo:', err);
      }
    }

    const [likesCount, commentsCount] = await Promise.all([
      deleteCollection(
        db,
        db.collection('likes').where('postId', '==', postId),
      ),
      deleteCollection(
        db,
        db.collection('comments').where('postId', '==', postId),
      ),
    ]);

    logger.log(
      `Post ${postId} cleaned up — likes: ${likesCount}, comments: ${commentsCount}`,
    );
  },
);
