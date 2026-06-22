import { auth } from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { UserRecord } from 'firebase-admin/auth';

const ANONYMIZED_AUTHOR = {
  'author.firstName': 'Deleted',
  'author.lastName': 'User',
  'author.photoURL': null,
  authorId: 'deleted_user',
};

async function anonymizeCollection(
  db: admin.firestore.Firestore,
  query: admin.firestore.Query,
  extraFields: Record<string, unknown> = {},
): Promise<number> {
  const snapshot = await query.get();
  if (snapshot.empty) return 0;

  const writer = db.bulkWriter();
  snapshot.forEach((doc) => {
    writer.update(doc.ref, { ...ANONYMIZED_AUTHOR, ...extraFields });
  });
  await writer.close();

  return snapshot.size;
}

export const onUserAccountDeleted = auth
  .user()
  .onDelete(async (user: UserRecord) => {
    const uid = user.uid;
    const db = admin.firestore();
    const bucket = admin.storage().bucket();

    logger.info(`User ${uid} deleted. Starting anonymization...`);

    await Promise.all([
      db.collection('users').doc(uid).delete(),
      bucket
        .file(`avatars/${uid}`)
        .delete()
        .catch((err: unknown) => {
          if (
            err &&
            typeof err === 'object' &&
            'code' in err &&
            (err as { code: number }).code === 404
          ) {
            logger.warn(`Avatar not found for user: ${uid}, skipping`);
          } else {
            logger.error('Failed to delete avatar:', err);
          }
        }),
    ]);

    const byAuthor = db.collection('posts').where('authorId', '==', uid);
    const byAuthorComments = db
      .collection('comments')
      .where('authorId', '==', uid);

    const [postsCount, commentsCount] = await Promise.all([
      anonymizeCollection(db, byAuthor, { isAnonymized: true }),
      anonymizeCollection(db, byAuthorComments, { isDeleted: true }),
    ]);

    logger.info(
      `Anonymized data for user ${uid} — posts: ${postsCount}, comments: ${commentsCount}`,
    );
  });
