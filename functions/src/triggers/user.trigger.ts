import { auth } from 'firebase-functions/v1';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { UserRecord } from 'firebase-admin/auth';
import { User } from '../modules/users/entities/user.entity';

const ANONYMIZED_AUTHOR = {
  'author.firstName': 'Deleted',
  'author.lastName': 'User',
  'author.photoURL': null,
  'author.emailVerified': false,
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
    void writer.update(doc.ref, { ...ANONYMIZED_AUTHOR, ...extraFields });
  });
  await writer.close();

  return snapshot.size;
}

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
      deleteCollection(db, byAuthor),
      anonymizeCollection(db, byAuthorComments, { isAnonymized: true }),
    ]);

    logger.info(
      `Cleaned up data for deleted user ${uid} — posts deleted: ${postsCount}, comments anonymized: ${commentsCount}`,
    );
  });

export const onUserUpdated = onDocumentUpdated(
  'users/{userId}',
  async (event) => {
    const userId = event.params.userId;
    const beforeData = event.data?.before.data() as Partial<User> | undefined;
    const afterData = event.data?.after.data() as Partial<User> | undefined;

    if (!afterData) {
      logger.error(`No data found for user: ${userId}`);
      return;
    }

    const fieldsToSync: (keyof User)[] = [
      'firstName',
      'lastName',
      'photoURL',
      'emailVerified',
    ];
    const hasChanged = fieldsToSync.some(
      (field) => beforeData?.[field] !== afterData[field],
    );

    if (!hasChanged) {
      logger.info(
        `User ${userId} updated, but no denormalized fields changed.`,
      );
      return;
    }

    const db = admin.firestore();
    logger.info(
      `User ${userId} updated. Propagating updates to posts and comments.`,
    );

    const [postsSnapshot, commentsSnapshot] = await Promise.all([
      db.collection('posts').where('authorId', '==', userId).get(),
      db.collection('comments').where('authorId', '==', userId).get(),
    ]);

    if (postsSnapshot.empty && commentsSnapshot.empty) {
      logger.info(`User ${userId} has no posts or comments to update.`);
      return;
    }

    const writer = db.bulkWriter();

    const updatePayload: Record<string, unknown> = {};
    if (afterData.firstName !== undefined) {
      updatePayload['author.firstName'] = afterData.firstName;
    }
    if (afterData.lastName !== undefined) {
      updatePayload['author.lastName'] = afterData.lastName;
    }
    updatePayload['author.photoURL'] = afterData.photoURL ?? null;
    updatePayload['author.emailVerified'] = afterData.emailVerified ?? false;

    postsSnapshot.forEach((doc) => {
      void writer.update(doc.ref, updatePayload);
    });

    commentsSnapshot.forEach((doc) => {
      void writer.update(doc.ref, updatePayload);
    });

    await writer.close();

    logger.info(
      `Successfully updated ${postsSnapshot.size} posts and ${commentsSnapshot.size} comments for user ${userId}`,
    );
  },
);
